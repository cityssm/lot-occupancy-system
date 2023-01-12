/* eslint-disable @typescript-eslint/indent */

import sqlite from 'better-sqlite3'

import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js'

import {
  dateStringToInteger,
  dateToInteger,
  dateToTimeInteger,
  timeStringToInteger
} from '@cityssm/expressjs-server-js/dateTimeFns.js'

import type * as recordTypes from '../../types/recordTypes'

interface CompleteWorkOrderMilestoneForm {
  workOrderMilestoneId: string | number
  workOrderMilestoneCompletionDateString?: string
  workOrderMilestoneCompletionTimeString?: string
}

export function completeWorkOrderMilestone(
  milestoneForm: CompleteWorkOrderMilestoneForm,
  requestSession: recordTypes.PartialSession
): boolean {
  const rightNow = new Date()

  const database = sqlite(databasePath)

  const result = database
    .prepare(
      `update WorkOrderMilestones
        set workOrderMilestoneCompletionDate = ?,
        workOrderMilestoneCompletionTime = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where workOrderMilestoneId = ?`
    )
    .run(
      milestoneForm.workOrderMilestoneCompletionDateString
        ? dateStringToInteger(
            milestoneForm.workOrderMilestoneCompletionDateString
          )
        : dateToInteger(rightNow),
      milestoneForm.workOrderMilestoneCompletionTimeString
        ? timeStringToInteger(
            milestoneForm.workOrderMilestoneCompletionTimeString
          )
        : dateToTimeInteger(rightNow),
      requestSession.user!.userName,
      rightNow.getTime(),
      milestoneForm.workOrderMilestoneId
    )

  database.close()

  return result.changes > 0
}

export default completeWorkOrderMilestone
