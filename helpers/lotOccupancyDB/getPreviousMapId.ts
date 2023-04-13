import { acquireConnection } from './pool.js'

export async function getPreviousMapId(
  mapId: number | string
): Promise<number | undefined> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `select mapId from Maps
        where recordDelete_timeMillis is null
        and mapName < (select mapName from Maps where mapId = ?)
        order by mapName desc
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

export default getPreviousMapId
