import {z} from "zod";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import Pokedex from "pokedex-promise-v2";

export function registerGetMoveTool(server: McpServer) {
  server.tool(
    "get-move",
    {
      move: z.string().describe("Move name (e.g., 'tackle', 'thunderbolt')"),
    },
    async ({move}) => {
      try {
        const pokedex = new Pokedex();
        const moveData = await pokedex.getMoveByName(
          move.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  id: moveData.id,
                  name: moveData.name,
                  accuracy: moveData.accuracy,
                  power: moveData.power,
                  pp: moveData.pp,
                  priority: moveData.priority,
                  type: moveData.type.name,
                  damage_class: moveData.damage_class?.name,
                  effect_entries:
                    moveData.effect_entries
                      .filter((e) => e.language.name === "en")
                      .map((e) => e.short_effect || e.effect)[0] ||
                    "No description available",
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (_error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Move "${move}" not found`,
            },
          ],
        };
      }
    },
  );
}
