import { acquireConnection } from './pool.js'

export async function getConfigTableMaxTimeMillis(): Promise<number> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `select max(timeMillis) as timeMillis from (
        select max(max(recordUpdate_timeMillis, ifnull(recordDelete_timeMillis,0))) as timeMillis
        from LotOccupantTypes
        UNION
        select max(max(recordUpdate_timeMillis, ifnull(recordDelete_timeMillis,0))) as timeMillis
        from LotStatuses
        UNION
        select max(max(recordUpdate_timeMillis, ifnull(recordDelete_timeMillis,0))) as timeMillis
        from LotTypes
        UNION
        select max(max(recordUpdate_timeMillis, ifnull(recordDelete_timeMillis,0))) as timeMillis
        from OccupancyTypes
        UNION
        select max(max(recordUpdate_timeMillis, ifnull(recordDelete_timeMillis,0))) as timeMillis
        from OccupancyTypeFields
        UNION
        select max(max(recordUpdate_timeMillis, ifnull(recordDelete_timeMillis,0))) as timeMillis
        from OccupancyTypePrints
        UNION
        select max(max(recordUpdate_timeMillis, ifnull(recordDelete_timeMillis,0))) as timeMillis
        from WorkOrderTypes
        UNION
        select max(max(recordUpdate_timeMillis, ifnull(recordDelete_timeMillis,0))) as timeMillis
        from WorkOrderMilestoneTypes
        )`
    )
    .get()

  database.release()

  return result?.timeMillis ?? 0
}

export default getConfigTableMaxTimeMillis
