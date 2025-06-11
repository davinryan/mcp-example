// Helper function for making NWS API requests
import { AlertFeature } from '../http.types';

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

export {
    formatAlert,
}