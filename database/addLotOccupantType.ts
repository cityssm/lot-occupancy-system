import { clearCacheByTableName } from '../helpers/functions.cache.js'

import { acquireConnection } from './pool.js'

export interface AddLotOccupantTypeForm {
  lotOccupantType: string
  fontAwesomeIconClass?: string
  occupantCommentTitle?: string
  orderNumber?: number
}

export default async function addLotOccupantType(
  lotOccupantTypeForm: AddLotOccupantTypeForm,
  user: User
): Promise<number> {
  const database = await acquireConnection()

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `insert into LotOccupantTypes (
        lotOccupantType, fontAwesomeIconClass, occupantCommentTitle, orderNumber,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      lotOccupantTypeForm.lotOccupantType,
      lotOccupantTypeForm.fontAwesomeIconClass ?? '',
      lotOccupantTypeForm.occupantCommentTitle ?? '',
      lotOccupantTypeForm.orderNumber ?? -1,
      user.userName,
      rightNowMillis,
      user.userName,
      rightNowMillis
    )

  database.release()

  clearCacheByTableName('LotOccupantTypes')

  return result.lastInsertRowid as number
}
