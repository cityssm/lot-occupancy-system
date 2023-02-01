import { acquireConnection } from './pool.js';
export async function getNextMapId(mapId) {
    const database = await acquireConnection();
    const result = database
        .prepare(`select mapId
        from Maps
        where recordDelete_timeMillis is null
        and mapName > (select mapName from Maps where mapId = ?)
        order by mapName
        limit 1`)
        .get(mapId);
    database.release();
    if (result === undefined) {
        return undefined;
    }
    return result.mapId;
}
export default getNextMapId;
