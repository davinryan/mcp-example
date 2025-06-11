import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ReadResourceResult } from '@modelcontextprotocol/sdk/types';
import { Variables } from '@modelcontextprotocol/sdk/shared/uriTemplate';
import * as z from 'zod';
import { ZodTypeAny } from 'zod';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const createServer = async () => {
    const server = new McpServer({
        name: 'My App',
        version: '1.0.0'
    });

    // Add an addition tool
    server.tool('add',
        { a: z.number(), b: z.number() },
        async ({ a, b }: z.objectOutputType<any, ZodTypeAny>) => ({
            content: [{ type: 'text', text: String(a + b) }]
        })
    );

    // Static resource
    server.resource(
        'config',
        'config://app',
        async (uri) => ({
            contents: [{
                uri: uri.href,
                text: 'App configuration here'
            }]
        })
    );

    // Dynamic resource with parameters
    server.resource(
        'greeting',
        new ResourceTemplate('greeting://{name}', { list: undefined }),
        async (uri: URL, { name }: Variables): Promise<ReadResourceResult> => ({
            contents: [{
                uri: uri.href,
                text: `Hello ${name}`
            }]
        })
    );

    const transport = new StdioServerTransport();
    await server.connect(transport);
};

export {
    createServer
};