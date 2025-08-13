import {z} from "zod";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import Pokedex from "pokedex-promise-v2";

export function registerGetTypeTool(server: McpServer) {
  server.tool(
    "get-type",
    {
      type: z.string().describe("Type name (e.g., 'fire', 'water')")
    },
    async ({type}) => {
      try {
        const pokedex = new Pokedex();
        const typeData = await pokedex.getTypeByName(type);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              id: typeData.id,
              name: typeData.name,
              damage_relations: {
                double_damage_to: typeData.damage_relations.double_damage_to.map(t => t.name),
                double_damage_from: typeData.damage_relations.double_damage_from.map(t => t.name),
                half_damage_to: typeData.damage_relations.half_damage_to.map(t => t.name),
                half_damage_from: typeData.damage_relations.half_damage_from.map(t => t.name),
                no_damage_to: typeData.damage_relations.no_damage_to.map(t => t.name),
                no_damage_from: typeData.damage_relations.no_damage_from.map(t => t.name)
              },
              pokemon: typeData.pokemon.slice(0, 10).map(p => p.pokemon.name)
            }, null, 2)
          }]
        };
      } catch (_error) {
        return {
          content: [{
            type: "text",
            text: `Error: Type "${type}" not found`
          }]
        };
      }
    }
  );
}