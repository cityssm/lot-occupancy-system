import { acquireConnection } from './pool.js'

import { clearCacheByTableName } from '../functions.cache.js'

import type * as recordTypes from '../../types/recordTypes'

interface UpdateLotTypeFieldForm {
  lotTypeFieldId: number | string
  lotTypeField: string
  isRequired: '0' | '1'
  minimumLength?: string
  maximumLength?: string
  pattern?: string
  lotTypeFieldValues: string
}

export async function updateLotTypeField(
  lotTypeFieldForm: UpdateLotTypeFieldForm,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const database = await acquireConnection()

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `update LotTypeFields
        set lotTypeField = ?,
        isRequired = ?,
        minimumLength = ?,
        maximumLength = ?,
        pattern = ?,
        lotTypeFieldValues = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where lotTypeFieldId = ?
        and recordDelete_timeMillis is null`
    )
    .run(
      lotTypeFieldForm.lotTypeField,
      Number.parseInt(lotTypeFieldForm.isRequired, 10),
      lotTypeFieldForm.minimumLength ?? 0,
      lotTypeFieldForm.maximumLength ?? 100,
      lotTypeFieldForm.pattern ?? '',
      lotTypeFieldForm.lotTypeFieldValues,
      requestSession.user!.userName,
      rightNowMillis,
      lotTypeFieldForm.lotTypeFieldId
    )

  database.release()

  clearCacheByTableName('LotTypeFields')

  return result.changes > 0
}

export default updateLotTypeField
