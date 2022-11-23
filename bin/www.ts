/* eslint-disable no-process-exit, unicorn/no-process-exit */

import { app } from "../app.js";

import http from "node:http";

import * as configFunctions from "../helpers/functions.config.js";

import exitHook from "exit-hook";
import ntfyPublish from "@cityssm/ntfy-publish";
import type * as ntfyTypes from "@cityssm/ntfy-publish/types";

import debug from "debug";
const debugWWW = debug("lot-occupancy-system:www");

let httpServer: http.Server;

interface ServerError extends Error {
    syscall: string;
    code: string;
}

const onError = (error: ServerError) => {
    if (error.syscall !== "listen") {
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        // eslint-disable-next-line no-fallthrough
        case "EACCES": {
            debugWWW("Requires elevated privileges");
            process.exit(1);
            // break;
        }

        // eslint-disable-next-line no-fallthrough
        case "EADDRINUSE": {
            debugWWW("Port is already in use.");
            process.exit(1);
            // break;
        }

        // eslint-disable-next-line no-fallthrough
        default: {
            throw error;
        }
    }
};

const onListening = (server: http.Server) => {
    const addr = server.address();

    if (addr) {
        const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port.toString();
        debugWWW("Listening on " + bind);
    }
};

/**
 * Initialize HTTP
 */

const httpPort = configFunctions.getProperty("application.httpPort");

if (httpPort) {
    httpServer = http.createServer(app);

    httpServer.listen(httpPort);

    httpServer.on("error", onError);
    httpServer.on("listening", () => {
        onListening(httpServer);
    });

    debugWWW("HTTP listening on " + httpPort.toString());

    const ntfyStartupConfig = configFunctions.getProperty("application.ntfyStartup");

    if (ntfyStartupConfig) {
        const topic = ntfyStartupConfig.topic;
        const server = ntfyStartupConfig.server;

        const ntfyMessage: ntfyTypes.NtfyMessageOptions = {
            topic,
            title: configFunctions.getProperty("application.applicationName"),
            message: "Application Started",
            tags: ["arrow_up"]
        };

        if (server) {
            ntfyMessage.server = server;
        }

        await ntfyPublish(ntfyMessage);
    }
}

exitHook(() => {
    if (httpServer) {
        debugWWW("Closing HTTP");
        httpServer.close();
    }
});
