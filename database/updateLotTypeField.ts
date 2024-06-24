import { clearCacheByTableName } from '../helpers/functions.cache.js'

import { acquireConnection } from './pool.js'

export interface UpdateLotTypeFieldForm {
  lotTypeFieldId: number | string
  lotTypeField: string
  isRequired: '0' | '1'
  minimumLength?: string
  maximumLength?: string
  pattern?: string
  lotTypeFieldValues: string
}

export default async function updateLotTypeField(
  lotTypeFieldForm: UpdateLotTypeFieldForm,
  user: User
): Promise<boolean> {
  const database = await acquireConnection()

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
      user.userName,
      Date.now(),
      lotTypeFieldForm.lotTypeFieldId
    )

  database.release()

  clearCacheByTableName('LotTypeFields')

  return result.changes > 0
}
