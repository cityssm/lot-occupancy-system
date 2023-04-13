import { acquireConnection } from './pool.js'
import type { PoolConnection } from 'better-sqlite-pool'

import type * as recordTypes from '../../types/recordTypes'

export async function getLotFields(
  lotId: number | string,
  connectedDatabase?: PoolConnection
): Promise<recordTypes.LotField[]> {
  const database = connectedDatabase ?? (await acquireConnection())

  const lotFields = database
    .prepare(
      `select l.lotId, l.lotTypeFieldId,
        l.lotFieldValue,
        f.lotTypeField, f.lotTypeFieldValues,
        f.isRequired, f.pattern, f.minimumLength, f.maximumLength,
        f.orderNumber, t.orderNumber as lotTypeOrderNumber
        from LotFields l
        left join LotTypeFields f on l.lotTypeFieldId = f.lotTypeFieldId
        left join LotTypes t on f.lotTypeId = t.lotTypeId
        where l.recordDelete_timeMillis is null
        and l.lotId = ?
    
        union
    
        select ? as lotId, f.lotTypeFieldId,
        '' as lotFieldValue,
        f.lotTypeField, f.lotTypeFieldValues,
        f.isRequired, f.pattern, f.minimumLength, f.maximumLength,
        f.orderNumber, t.orderNumber as lotTypeOrderNumber
        from LotTypeFields f
        left join LotTypes t on f.lotTypeId = t.lotTypeId
        where f.recordDelete_timeMillis is null
        and (
            f.lotTypeId is null
            or f.lotTypeId in (select lotTypeId from Lots where lotId = ?))
        and f.lotTypeFieldId not in (select lotTypeFieldId from LotFields where lotId = ? and recordDelete_timeMillis is null)
        order by lotTypeOrderNumber, f.orderNumber, f.lotTypeField`
    )
    .all(lotId, lotId, lotId, lotId) as recordTypes.LotField[]

  if (connectedDatabase === undefined) {
    database.release()
  }

  return lotFields
}

export default getLotFields
