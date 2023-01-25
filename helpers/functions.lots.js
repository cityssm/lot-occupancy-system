import NodeCache from 'node-cache';
import getPreviousLotIdFromDatabase from './lotOccupancyDB/getPreviousLotId.js';
import getNextLotIdFromDatabase from './lotOccupancyDB/getNextLotId.js';
const cacheOptions = {
    stdTTL: 2 * 60,
    useClones: false
};
const previousLotIdCache = new NodeCache(cacheOptions);
const nextLotIdCache = new NodeCache(cacheOptions);
function cacheLotIds(lotId, nextLotId) {
    previousLotIdCache.set(nextLotId, lotId);
    nextLotIdCache.set(lotId, nextLotId);
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
        nextLotIdCache.del(lotId);
    }
}
