import { clearCacheByTableName } from '../helpers/functions.cache.js'

import { acquireConnection } from './pool.js'

export interface AddLotTypeFieldForm {
  lotTypeId: string | number
  lotTypeField: string
  fieldType?: string
  lotTypeFieldValues?: string
  isRequired?: string
  pattern?: string
  minimumLength?: string | number
  maximumLength?: string | number
  orderNumber?: number
}

export default async function addLotTypeField(
  lotTypeFieldForm: AddLotTypeFieldForm,
  user: User
): Promise<number> {
  const database = await acquireConnection()

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `insert into LotTypeFields (
        lotTypeId, lotTypeField, fieldType, lotTypeFieldValues,
        isRequired, pattern,
        minimumLength, maximumLength,
        orderNumber,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      lotTypeFieldForm.lotTypeId,
      lotTypeFieldForm.lotTypeField,
      lotTypeFieldForm.fieldType ?? 'text',
      lotTypeFieldForm.lotTypeFieldValues ?? '',
      lotTypeFieldForm.isRequired === '' ? 0 : 1,
      lotTypeFieldForm.pattern ?? '',
      lotTypeFieldForm.minimumLength ?? 0,
      lotTypeFieldForm.maximumLength ?? 100,
      lotTypeFieldForm.orderNumber ?? -1,
      user.userName,
      rightNowMillis,
      user.userName,
      rightNowMillis
    )

  database.release()

  clearCacheByTableName('LotTypeFields')

  return result.lastInsertRowid as number
}
