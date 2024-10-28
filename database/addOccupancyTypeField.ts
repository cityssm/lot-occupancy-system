import { clearCacheByTableName } from '../helpers/functions.cache.js'

import { acquireConnection } from './pool.js'

export interface AddOccupancyTypeFieldForm {
  occupancyTypeId?: string | number
  occupancyTypeField: string
  occupancyTypeFieldValues?: string
  fieldType?: string
  isRequired?: string
  pattern?: string
  minimumLength?: string | number
  maximumLength?: string | number
  orderNumber?: number
}

export default async function addOccupancyTypeField(
  occupancyTypeFieldForm: AddOccupancyTypeFieldForm,
  user: User
): Promise<number> {
  const database = await acquireConnection()

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `insert into OccupancyTypeFields (
        occupancyTypeId, occupancyTypeField, fieldType,
        occupancyTypeFieldValues, isRequired, pattern,
        minimumLength, maximumLength,
        orderNumber,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      occupancyTypeFieldForm.occupancyTypeId ?? undefined,
      occupancyTypeFieldForm.occupancyTypeField,
      occupancyTypeFieldForm.fieldType ?? 'text',
      occupancyTypeFieldForm.occupancyTypeFieldValues ?? '',
      occupancyTypeFieldForm.isRequired === '' ? 0 : 1,
      occupancyTypeFieldForm.pattern ?? '',
      occupancyTypeFieldForm.minimumLength ?? 0,
      occupancyTypeFieldForm.maximumLength ?? 100,
      occupancyTypeFieldForm.orderNumber ?? -1,
      user.userName,
      rightNowMillis,
      user.userName,
      rightNowMillis
    )

  database.release()

  clearCacheByTableName('OccupancyTypeFields')

  return result.lastInsertRowid as number
}
