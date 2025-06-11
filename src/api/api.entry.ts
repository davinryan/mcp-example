// Start receiving messages on stdin and sending messages on stdout
// import { createHttpServer } from './mcp/http/http.server';
import { createStdioServer } from './mcp/stdio/stdio.server';

const main = async () => {
    process.on('SIGINT', async () => {
        console.log('Shutting down MCP server...');
        // Clean shutdown logic here
        process.exit(0);
    });
    // createHttpServer();
    await createStdioServer()
};

main().catch(console.error);
