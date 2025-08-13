import {z} from "zod";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import Pokedex from "pokedex-promise-v2";

export function registerGetPokemonTool(server: McpServer) {
  server.tool(
    "get-pokemon",
    {
      pokemon: z.string().describe("Pokémon name or ID")
    },
    async ({pokemon}) => {
      try {
        const pokedex = new Pokedex();
        const pokemonData = await pokedex.getPokemonByName(pokemon);
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              id: pokemonData.id,
              name: pokemonData.name,
              height: pokemonData.height,
              weight: pokemonData.weight,
              types: pokemonData.types.map((t: any) => t.type.name),
              abilities: pokemonData.abilities.map((a: any) => a.ability.name),
              stats: pokemonData.stats.map((s: any) => ({
                name: s.stat.name,
                base_stat: s.base_stat,
              })),
              sprite: pokemonData.sprites.front_default,
            }, null, 2)
          }]
        };
      } catch (_error) {
        return {
          content: [{
            type: "text",
            text: `Error: Pokémon "${pokemon}" not found`
          }]
        };
      }
    }
  );
}
