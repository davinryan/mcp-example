import chalk from 'chalk';
import { ProxyOptions } from 'vite';

const prettyPrintLog = (type: string, message: string, details: Record<string, unknown> = {}) => {
    const header = chalk.bgBlue.white.bold(` ${type.toUpperCase()} `);
    const body = `${chalk.blue(message)}\n${chalk.gray(JSON.stringify(details, null, 2))}`;
    console.log(`${header} ${body}`);
};

export const createProxyRoute = (target: string): ProxyOptions => {
    return {
        target,
        changeOrigin: true,
        configure: (proxy) => {
            proxy.on('error', (err) => {
                prettyPrintLog('Error', 'Proxy error occurred', { error: err });
            });
            proxy.on('proxyReq', (proxyReq, req) => {
                prettyPrintLog('Proxy Request', 'Sending Request to Target', {
                    method: req.method,
                    url: req.url,
                    targetMethod: proxyReq.method,
                    targetProtocol: proxyReq.protocol,
                    targetHost: proxyReq.host
                });
            });
            proxy.on('proxyRes', (proxyRes, req) => {
                prettyPrintLog('Proxy Response', 'Received Response from Target', {
                    statusCode: proxyRes.statusCode,
                    url: req.url
                });
            });
        }
    };
};
