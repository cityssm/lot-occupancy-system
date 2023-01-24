import { app } from '../app.js';
import http from 'node:http';
import * as configFunctions from '../helpers/functions.config.js';
import exitHook from 'exit-hook';
import ntfyPublish from '@cityssm/ntfy-publish';
import Debug from 'debug';
const debug = Debug('lot-occupancy-system:www');
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    switch (error.code) {
        case 'EACCES': {
            debug('Requires elevated privileges');
            process.exit(1);
        }
        case 'EADDRINUSE': {
            debug('Port is already in use.');
            process.exit(1);
        }
        default: {
            throw error;
        }
    }
}
function onListening(server) {
    const addr = server.address();
    if (addr !== null) {
        const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port.toString();
        debug('Listening on ' + bind);
    }
}
const ntfyStartupConfig = configFunctions.getProperty('application.ntfyStartup');
const httpPort = configFunctions.getProperty('application.httpPort');
const httpServer = http.createServer(app);
httpServer.listen(httpPort);
httpServer.on('error', onError);
httpServer.on('listening', () => {
    onListening(httpServer);
});
debug('HTTP listening on ' + httpPort.toString());
exitHook(() => {
    debug('Closing HTTP');
    httpServer.close();
});
if (ntfyStartupConfig) {
    const topic = ntfyStartupConfig.topic;
    const server = ntfyStartupConfig.server;
    const ntfyStartupMessage = {
        topic,
        title: configFunctions.getProperty('application.applicationName'),
        message: 'Application Started',
        tags: ['arrow_up']
    };
    const ntfyShutdownMessage = {
        topic,
        title: configFunctions.getProperty('application.applicationName'),
        message: 'Application Shut Down',
        tags: ['arrow_down']
    };
    if (server) {
        ntfyStartupMessage.server = server;
        ntfyShutdownMessage.server = server;
    }
    await ntfyPublish(ntfyStartupMessage);
    exitHook(() => {
        debug('Sending ntfy notification');
        void ntfyPublish(ntfyShutdownMessage);
    });
}
