import {z} from "zod";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import Pokedex from "pokedex-promise-v2";

export function registerGetAbilityTool(server: McpServer) {
  server.tool(
    "get-ability",
    {
      ability: z.string().describe("Ability name (e.g., 'overgrow', 'blaze')"),
    },
    async ({ability}) => {
      try {
        const pokedex = new Pokedex();
        const abilityData = await pokedex.getAbilityByName(ability);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  id: abilityData.id,
                  name: abilityData.name,
                  is_main_series: abilityData.is_main_series,
                  effect:
                    abilityData.effect_entries
                      .filter((e) => e.language.name === "en")
                      .map((e) => e.short_effect || e.effect)[0] ||
                    "No description available",
                  pokemon: abilityData.pokemon
                    .slice(0, 10)
                    .map((p) => p.pokemon.name),
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
              text: `Error: Ability "${ability}" not found`,
            },
          ],
        };
      }
    },
  );
}
