import dotenv from "dotenv";
import { MCPClient } from './mcp/MCPClient';

dotenv.config();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
}

const main = async () => {
    if (process.argv.length < 3) {
        console.log("Usage: node <path_to_client_entry> <path_to_server_entry>");
        return;
    }
    const mcpClient = new MCPClient();
    try {
        await mcpClient.connectToServer(process.argv[2]);
        await mcpClient.chatLoop();
    } finally {
        await mcpClient.cleanup();
        process.exit(0);
    }
}

main();