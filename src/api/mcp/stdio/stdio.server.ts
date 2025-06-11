import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerGetForecastTool } from '../tools/tools.getForecast';
import { registerGetAlertsTool } from '../tools/tools.getAlerts';

const createStdioServer = async () => {
    const server = new McpServer({
        name: 'My App',
        version: '1.0.0'
    });

    // ... set up server resources, tools, and prompts ...
    registerGetForecastTool(server);
    registerGetAlertsTool(server);

    // Setup Server
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.warn('MCP server started and listening on stdin/stdout');
};

export {
    createStdioServer
};