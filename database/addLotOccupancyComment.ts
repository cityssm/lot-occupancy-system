import {
  dateStringToInteger,
  dateToInteger,
  dateToTimeInteger,
  timeStringToInteger
} from '@cityssm/utils-datetime'

import { acquireConnection } from './pool.js'

export interface AddLotOccupancyCommentForm {
  lotOccupancyId: string | number
  lotOccupancyCommentDateString?: string
  lotOccupancyCommentTimeString?: string
  lotOccupancyComment: string
}

export default async function addLotOccupancyComment(
  commentForm: AddLotOccupancyCommentForm,
  user: User
): Promise<number> {
  const rightNow = new Date()

  let lotOccupancyCommentDate: number
  let lotOccupancyCommentTime: number

  if (commentForm.lotOccupancyCommentDateString) {
    lotOccupancyCommentDate = dateStringToInteger(
      commentForm.lotOccupancyCommentDateString
    )
    lotOccupancyCommentTime = timeStringToInteger(
      commentForm.lotOccupancyCommentTimeString ?? ''
    )
  } else {
    lotOccupancyCommentDate = dateToInteger(rightNow)
    lotOccupancyCommentTime = dateToTimeInteger(rightNow)
  }

  const database = await acquireConnection()

  const result = database
    .prepare(
      `insert into LotOccupancyComments (
        lotOccupancyId,
        lotOccupancyCommentDate, lotOccupancyCommentTime,
        lotOccupancyComment,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      commentForm.lotOccupancyId,
      lotOccupancyCommentDate,
      lotOccupancyCommentTime ?? 0,
      commentForm.lotOccupancyComment,
      user.userName,
      rightNow.getTime(),
      user.userName,
      rightNow.getTime()
    )

  database.release()

  return result.lastInsertRowid as number
}
