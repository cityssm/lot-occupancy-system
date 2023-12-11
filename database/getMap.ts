import type { MapRecord } from '../types/recordTypes.js'

import { acquireConnection } from './pool.js'

export async function getMap(
  mapId: number | string
): Promise<MapRecord | undefined> {
  const database = await acquireConnection()

  const map = database
    .prepare(
      `select m.mapId, m.mapName, m.mapDescription,
        m.mapLatitude, m.mapLongitude, m.mapSVG,
        m.mapAddress1, m.mapAddress2, m.mapCity, m.mapProvince, m.mapPostalCode,
        m.mapPhoneNumber,
        m.recordCreate_userName, m.recordCreate_timeMillis,
        m.recordUpdate_userName, m.recordUpdate_timeMillis,
        m.recordDelete_userName, m.recordDelete_timeMillis,
        count(l.lotId) as lotCount
        from Maps m
        left join Lots l on m.mapId = l.mapId and l.recordDelete_timeMillis is null
        where m.mapId = ?
          and m.recordDelete_timeMillis is null
        group by m.mapId, m.mapName, m.mapDescription,
          m.mapLatitude, m.mapLongitude, m.mapSVG,
          m.mapAddress1, m.mapAddress2, m.mapCity, m.mapProvince, m.mapPostalCode,
          m.mapPhoneNumber,
          m.recordCreate_userName, m.recordCreate_timeMillis,
          m.recordUpdate_userName, m.recordUpdate_timeMillis,
          m.recordDelete_userName, m.recordDelete_timeMillis`
    )
    .get(mapId) as MapRecord | undefined

  database.release()

  return map
}

export default getMap
