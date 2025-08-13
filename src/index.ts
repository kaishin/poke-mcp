import {McpAgent} from "agents/mcp";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {registerGetPokemonTool} from "./tools/get-pokemon.js";
import {registerGetTypeTool} from "./tools/get-type.js";
import {registerGetMoveTool} from "./tools/get-move.js";
import {registerGetAbilityTool} from "./tools/get-ability.js";
import {registerGetSpeciesTool} from "./tools/get-species.js";

// Define our MCP agent with tools
export class PokefinderMCP extends McpAgent {
  server = new McpServer({
    name: "Pokefinder",
    version: "1.0.0",
  });

  async init() {
    registerGetPokemonTool(this.server);
    registerGetTypeTool(this.server);
    registerGetMoveTool(this.server);
    registerGetAbilityTool(this.server);
    registerGetSpeciesTool(this.server);
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      return PokefinderMCP.serveSSE("/sse").fetch(request, env, ctx);
    }

    if (url.pathname === "/mcp") {
      return PokefinderMCP.serve("/mcp").fetch(request, env, ctx);
    }

    return new Response("Not found", {status: 404});
  },
};