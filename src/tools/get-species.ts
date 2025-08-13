import {z} from "zod";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import Pokedex from "pokedex-promise-v2";

export function registerGetSpeciesTool(server: McpServer) {
  server.tool(
    "get-species",
    {
      species: z.string().describe("Species name or ID")
    },
    async ({species}) => {
      try {
        const pokedex = new Pokedex();
        const speciesData = await pokedex.getPokemonSpeciesByName(
          species.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
        );
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              id: speciesData.id,
              name: speciesData.name,
              color: speciesData.color.name,
              habitat: speciesData.habitat?.name,
              generation: speciesData.generation.name,
              is_legendary: speciesData.is_legendary,
              is_mythical: speciesData.is_mythical,
              capture_rate: speciesData.capture_rate,
              base_happiness: speciesData.base_happiness,
              growth_rate: speciesData.growth_rate.name,
              flavor_text: speciesData.flavor_text_entries
                .filter(e => e.language.name === 'en')
                .slice(0, 1)
                .map(e => e.flavor_text)[0] || "No description available"
            }, null, 2)
          }]
        };
      } catch (_error) {
        return {
          content: [{
            type: "text",
            text: `Error: Species "${species}" not found`
          }]
        };
      }
    }
  );
}