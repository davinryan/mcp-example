// Start receiving messages on stdin and sending messages on stdout
import { createHttpServer } from './mcp/http/http.server';

const main = async () => {
    process.on('SIGINT', async () => {
        console.log('Shutting down MCP server...');
        // Clean shutdown logic here
        process.exit(0);
    });
    createHttpServer();
};

main().catch(console.error);
