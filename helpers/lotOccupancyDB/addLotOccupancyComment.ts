import { acquireConnection } from './pool.js'

import {
  dateStringToInteger,
  dateToInteger,
  dateToTimeInteger,
  timeStringToInteger
} from '@cityssm/expressjs-server-js/dateTimeFns.js'

import type * as recordTypes from '../../types/recordTypes'

interface AddLotOccupancyCommentForm {
  lotOccupancyId: string | number
  lotOccupancyCommentDateString?: string
  lotOccupancyCommentTimeString?: string
  lotOccupancyComment: string
}

export async function addLotOccupancyComment(
  commentForm: AddLotOccupancyCommentForm,
  requestSession: recordTypes.PartialSession
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
      lotOccupancyCommentTime,
      commentForm.lotOccupancyComment,
      requestSession.user!.userName,
      rightNow.getTime(),
      requestSession.user!.userName,
      rightNow.getTime()
    )

  database.release()

  return result.lastInsertRowid as number
}

export default addLotOccupancyComment
