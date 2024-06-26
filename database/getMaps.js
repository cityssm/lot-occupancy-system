import { acquireConnection } from './pool.js';
export default async function getMaps() {
    const database = await acquireConnection();
    const maps = database
        .prepare(`select m.mapId, m.mapName, m.mapDescription,
        m.mapLatitude, m.mapLongitude, m.mapSVG,
        m.mapAddress1, m.mapAddress2, m.mapCity, m.mapProvince, m.mapPostalCode,
        m.mapPhoneNumber,
        ifnull(l.lotCount,0) as lotCount
        from Maps m
        left join (
          select mapId, count(lotId) as lotCount
          from Lots
          where recordDelete_timeMillis is null group by mapId
        ) l on m.mapId = l.mapId
        where m.recordDelete_timeMillis is null order by m.mapName, m.mapId`)
        .all();
    database.release();
    return maps;
}
