import { dateToInteger, dateToTimeInteger } from '@cityssm/utils-datetime'

import { acquireConnection } from './pool.js'

export interface AddLotCommentForm {
  lotId: string
  lotComment: string
}

export default async function addLotComment(
  lotCommentForm: AddLotCommentForm,
  user: User
): Promise<number> {
  const database = await acquireConnection()

  const rightNow = new Date()

  const result = database
    .prepare(
      `insert into LotComments (
        lotId,
        lotCommentDate, lotCommentTime, lotComment,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis) 
        values (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      lotCommentForm.lotId,
      dateToInteger(rightNow),
      dateToTimeInteger(rightNow),
      lotCommentForm.lotComment,
      user.userName,
      rightNow.getTime(),
      user.userName,
      rightNow.getTime()
    )

  database.release()

  return result.lastInsertRowid as number
}
