import {z} from "zod";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";

// export function registerFindTool(server: McpServer, props: Props) {
//   server.tool(
//     "find",
//     {
//       query: z.string(),
//       limit: z.number().optional().default(10),
//     },
//     async ({query, limit}) => {
//       // Simulate a search operation
//       const results = await props.search(query, limit);
//       return {
//         content: results.map((result) => ({
//           type: "text",
//           text: `Found: ${result}`,
//         })),
//       };
//     },
//   );
// }
