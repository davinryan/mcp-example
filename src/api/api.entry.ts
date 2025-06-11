// Start receiving messages on stdin and sending messages on stdout
// import { createSSEServer } from './mcp/sse/sse.server';
import { createStdioServer } from './mcp/stdio/stdio.server';

const main = async () => {
    process.on('SIGINT', async () => {
        console.log('Shutting down MCP server...');
        // Clean shutdown logic here
        process.exit(0);
    });
    // createSSEServer();
    await createStdioServer()
};

main().catch(console.error);
