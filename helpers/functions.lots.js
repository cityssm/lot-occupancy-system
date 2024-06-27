import cluster from 'node:cluster';
import Debug from 'debug';
import NodeCache from 'node-cache';
import getNextLotIdFromDatabase from '../database/getNextLotId.js';
import getPreviousLotIdFromDatabase from '../database/getPreviousLotId.js';
const debug = Debug(`lot-occupancy-system:functions.lots:${process.pid}`);
const cacheOptions = {
    stdTTL: 2 * 60, // two minutes
    useClones: false
};
const previousLotIdCache = new NodeCache(cacheOptions);
const nextLotIdCache = new NodeCache(cacheOptions);
function cacheLotIds(lotId, nextLotId, relayMessage = true) {
    previousLotIdCache.set(nextLotId, lotId);
    nextLotIdCache.set(lotId, nextLotId);
    try {
        if (relayMessage && cluster.isWorker) {
            const workerMessage = {
                messageType: 'cacheLotIds',
                lotId,
                nextLotId,
                timeMillis: Date.now(),
                pid: process.pid
            };
            debug(`Sending cache lot ids from worker: (${lotId}, ${nextLotId})`);
            process.send(workerMessage);
        }
    }
    catch { }
}
export async function getNextLotId(lotId) {
    let nextLotId = nextLotIdCache.get(lotId);
    if (nextLotId === undefined) {
        nextLotId = await getNextLotIdFromDatabase(lotId);
        if (nextLotId !== undefined) {
            cacheLotIds(lotId, nextLotId);
        }
    }
    return nextLotId;
}
export async function getPreviousLotId(lotId) {
    let previousLotId = previousLotIdCache.get(lotId);
    if (previousLotId === undefined) {
        previousLotId = await getPreviousLotIdFromDatabase(lotId);
        if (previousLotId !== undefined) {
            cacheLotIds(previousLotId, lotId);
        }
    }
    return previousLotId;
}
export function clearNextPreviousLotIdCache(lotId, relayMessage = true) {
    if (lotId === undefined || lotId === -1) {
        previousLotIdCache.flushAll();
        nextLotIdCache.flushAll();
        return;
    }
    const previousLotId = previousLotIdCache.get(lotId);
    if (previousLotId !== undefined) {
        nextLotIdCache.del(previousLotId);
        previousLotIdCache.del(lotId);
    }
    const nextLotId = nextLotIdCache.get(lotId);
    if (nextLotId !== undefined) {
        previousLotIdCache.del(nextLotId);
        nextLotIdCache.del(lotId);
    }
    try {
        if (relayMessage && cluster.isWorker) {
            const workerMessage = {
                messageType: 'clearNextPreviousLotIdCache',
                lotId,
                timeMillis: Date.now(),
                pid: process.pid
            };
            debug(`Sending clear next/previous lot cache from worker: ${lotId}`);
            process.send(workerMessage);
        }
    }
    catch { }
}
process.on('message', (message) => {
    if (message.pid !== process.pid) {
        switch (message.messageType) {
            case 'cacheLotIds': {
                debug(`Caching lot ids: (${message.lotId}, ${message.nextLotId})`);
                cacheLotIds(message.lotId, message.nextLotId, false);
                break;
            }
            case 'clearNextPreviousLotIdCache': {
                debug(`Clearing next/previous lot cache: ${message.lotId}`);
                clearNextPreviousLotIdCache(message.lotId, false);
                break;
            }
        }
    }
});
