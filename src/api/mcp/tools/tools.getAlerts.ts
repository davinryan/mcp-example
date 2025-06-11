import * as z from 'zod';
import { AlertFeature, AlertsResponse } from './tools.types';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { makeNWSRequest } from './tools.service';

const NWS_API_BASE = 'https://api.weather.gov';

const formatAlert = (feature: AlertFeature) => {
    const props = feature.properties;
    return [
        `Event: ${props.event || "Unknown"}`,
        `Area: ${props.areaDesc || "Unknown"}`,
        `Severity: ${props.severity || "Unknown"}`,
        `Status: ${props.status || "Unknown"}`,
        `Headline: ${props.headline || "No headline"}`,
        "---",
    ].join("\n");
}

const registerGetAlertsTool = (server: McpServer) => {
    server.tool(
        'get-alerts',
        'Get weather alerts for a state',
        {
            state: z.string().length(2).describe('Two-letter state code (e.g. CA, NY)')
        },
        async ({ state }) => {
            const stateCode = state.toUpperCase();
            const alertsUrl = `${NWS_API_BASE}/alerts?area=${stateCode}`;
            const alertsData = await makeNWSRequest<AlertsResponse>(alertsUrl);

            if (!alertsData) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'Failed to retrieve alerts data'
                        }
                    ]
                };
            }

            const features = alertsData.features || [];
            if (features.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `No active alerts for ${stateCode}`
                        }
                    ]
                };
            }

            const formattedAlerts = features.map(formatAlert);
            const alertsText = `Active alerts for ${stateCode}:\n\n${formattedAlerts.join('\n')}`;

            return {
                content: [
                    {
                        type: 'text',
                        text: alertsText
                    }
                ]
            };
        }
    );
}
export {
    registerGetAlertsTool
};