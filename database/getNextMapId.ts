import { acquireConnection } from './pool.js'

export default async function getNextMapId(
  mapId: number | string
): Promise<number | undefined> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `select mapId
        from Maps
        where recordDelete_timeMillis is null
        and mapName > (select mapName from Maps where mapId = ?)
        order by mapName
        limit 1`
    )
    .get(mapId) as {
    mapId: number
  }

  database.release()

  if (result === undefined) {
    return undefined
  }

  return result.mapId
}
