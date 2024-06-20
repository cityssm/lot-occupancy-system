import { acquireConnection } from './pool.js'

export default async function deleteLotOccupancyOccupant(
  lotOccupancyId: number | string,
  lotOccupantIndex: number | string,
  user: User
): Promise<boolean> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `update LotOccupancyOccupants
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where lotOccupancyId = ?
        and lotOccupantIndex = ?`
    )
    .run(user.userName, Date.now(), lotOccupancyId, lotOccupantIndex)

  database.release()

  return result.changes > 0
}
