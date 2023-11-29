import { clearCacheByTableName } from '../functions.cache.js'

import { acquireConnection } from './pool.js'

interface UpdateOccupancyTypeFieldForm {
  occupancyTypeFieldId: number | string
  occupancyTypeField: string
  isRequired: '0' | '1'
  minimumLength?: string
  maximumLength?: string
  pattern?: string
  occupancyTypeFieldValues: string
}

export async function updateOccupancyTypeField(
  occupancyTypeFieldForm: UpdateOccupancyTypeFieldForm,
  user: User
): Promise<boolean> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `update OccupancyTypeFields
        set occupancyTypeField = ?,
        isRequired = ?,
        minimumLength = ?,
        maximumLength = ?,
        pattern = ?,
        occupancyTypeFieldValues = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where occupancyTypeFieldId = ?
        and recordDelete_timeMillis is null`
    )
    .run(
      occupancyTypeFieldForm.occupancyTypeField,
      Number.parseInt(occupancyTypeFieldForm.isRequired, 10),
      occupancyTypeFieldForm.minimumLength ?? 0,
      occupancyTypeFieldForm.maximumLength ?? 100,
      occupancyTypeFieldForm.pattern ?? '',
      occupancyTypeFieldForm.occupancyTypeFieldValues,
      user.userName,
      Date.now(),
      occupancyTypeFieldForm.occupancyTypeFieldId
    )

  database.release()

  clearCacheByTableName('OccupancyTypeFields')

  return result.changes > 0
}

export default updateOccupancyTypeField
