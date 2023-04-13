import { acquireConnection } from './pool.js'

import type * as recordTypes from '../../types/recordTypes'

interface GetFilters {
  mapId?: number | string
}

interface LotStatusSummary extends recordTypes.LotStatus {
  lotCount: number
}

export async function getLotStatusSummary(
  filters: GetFilters
): Promise<LotStatusSummary[]> {
  const database = await acquireConnection()

  let sqlWhereClause = ' where l.recordDelete_timeMillis is null'
  const sqlParameters: unknown[] = []

  if ((filters.mapId ?? '') !== '') {
    sqlWhereClause += ' and l.mapId = ?'
    sqlParameters.push(filters.mapId)
  }

  const lotStatuses = database
    .prepare(
      `select s.lotStatusId, s.lotStatus, count(l.lotId) as lotCount
        from Lots l
        left join LotStatuses s on l.lotStatusId = s.lotStatusId
        ${sqlWhereClause}
        group by s.lotStatusId, s.lotStatus, s.orderNumber
        order by s.orderNumber`
    )
    .all(sqlParameters) as LotStatusSummary[]

  database.release()

  return lotStatuses
}

export default getLotStatusSummary
