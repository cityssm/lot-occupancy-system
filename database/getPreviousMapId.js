import { acquireConnection } from './pool.js';
export default async function getPreviousMapId(mapId) {
    const database = await acquireConnection();
    const result = database
        .prepare(`select mapId from Maps
        where recordDelete_timeMillis is null
        and mapName < (select mapName from Maps where mapId = ?)
        order by mapName desc
        limit 1`)
        .get(mapId);
    database.release();
    if (result === undefined) {
        return undefined;
    }
    return result.mapId;
}
