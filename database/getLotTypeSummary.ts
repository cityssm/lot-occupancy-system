import type { LotType } from '../types/recordTypes.js'

import { acquireConnection } from './pool.js'

interface GetFilters {
  mapId?: number | string
}

interface LotTypeSummary extends LotType {
  lotCount: number
}

export default async function getLotTypeSummary(
  filters: GetFilters
): Promise<LotTypeSummary[]> {
  const database = await acquireConnection()

  let sqlWhereClause = ' where l.recordDelete_timeMillis is null'
  const sqlParameters: unknown[] = []

  if ((filters.mapId ?? '') !== '') {
    sqlWhereClause += ' and l.mapId = ?'
    sqlParameters.push(filters.mapId)
  }

  const lotTypes = database
    .prepare(
      `select t.lotTypeId, t.lotType, count(l.lotId) as lotCount
        from Lots l
        left join LotTypes t on l.lotTypeId = t.lotTypeId
        ${sqlWhereClause}
        group by t.lotTypeId, t.lotType, t.orderNumber
        order by t.orderNumber`
    )
    .all(sqlParameters) as LotTypeSummary[]

  database.release()

  return lotTypes
}
