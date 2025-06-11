import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { registerGetAlertsTool } from '../tools/tools.getAlerts';
import { registerGetForecastTool } from '../tools/tools.getForecast';

const createHttpServer = () => {
    const server = new McpServer({
        name: 'My App',
        version: '1.0.0'
    });

    // ... set up server resources, tools, and prompts ...
    registerGetAlertsTool(server);
    registerGetForecastTool(server);

    // Setup server
    const app = express();
    app.use(express.json());

    // Store transports for each session type
    const transports = {
        streamable: {} as Record<string, StreamableHTTPServerTransport>,
        sse: {} as Record<string, SSEServerTransport>
    };

    // Modern Streamable HTTP endpoint
    app.all('/mcp', async (req, res) => {
        // Handle Streamable HTTP transport for modern clients
        // Implementation as shown in the "With Session Management" example
        // ...
    });

    // Legacy SSE endpoint for older clients
    app.get('/sse', async (req, res) => {
        // Create SSE transport for legacy clients
        const transport = new SSEServerTransport('/messages', res);
        transports.sse[transport.sessionId] = transport;

        res.on('close', () => {
            delete transports.sse[transport.sessionId];
        });

        await server.connect(transport);
    });

    // Legacy message endpoint for older clients
    app.post('/messages', async (req, res) => {
        const sessionId = req.query.sessionId as string;
        const transport = transports.sse[sessionId];
        if (transport) {
            await transport.handlePostMessage(req, res, req.body);
        } else {
            res.status(400).send('No transport found for sessionId');
        }
    });

    app.listen(3000);
    console.warn('MCP server started and listening on port 3000');
};

export {
    createHttpServer
};