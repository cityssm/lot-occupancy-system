import NodeCache from 'node-cache';
import getPreviousLotIdFromDatabase from './lotOccupancyDB/getPreviousLotId.js';
import getNextLotIdFromDatabase from './lotOccupancyDB/getNextLotId.js';
const timeToLiveMinutes = 2;
const previousLotIdCache = new NodeCache({
    stdTTL: timeToLiveMinutes * 60
});
const nextLotIdCache = new NodeCache({
    stdTTL: timeToLiveMinutes * 60
});
export async function getNextLotId(lotId) {
    let nextLotId = nextLotIdCache.get(lotId);
    if (nextLotId === undefined) {
        nextLotId = await getNextLotIdFromDatabase(lotId);
        if (nextLotId !== undefined) {
            previousLotIdCache.set(nextLotId, lotId);
            nextLotIdCache.set(lotId, nextLotId);
        }
    }
    return nextLotId;
}
export async function getPreviousLotId(lotId) {
    let previousLotId = previousLotIdCache.get(lotId);
    if (previousLotId === undefined) {
        previousLotId = await getPreviousLotIdFromDatabase(lotId);
        if (previousLotId !== undefined) {
            previousLotIdCache.set(lotId, previousLotId);
            nextLotIdCache.set(previousLotId, lotId);
        }
    }
    return previousLotId;
}
export function clearNextPreviousLotIdCache(lotId) {
    if (lotId === undefined) {
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
        nextLotIdCache.del(nextLotId);
    }
}
