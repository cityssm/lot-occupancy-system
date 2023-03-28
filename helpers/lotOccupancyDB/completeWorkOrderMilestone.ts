/* eslint-disable @typescript-eslint/indent */

import { acquireConnection } from './pool.js'

import {
  dateStringToInteger,
  dateToInteger,
  dateToTimeInteger,
  timeStringToInteger
} from '@cityssm/utils-datetime'

import type * as recordTypes from '../../types/recordTypes'

interface CompleteWorkOrderMilestoneForm {
  workOrderMilestoneId: string | number
  workOrderMilestoneCompletionDateString?: string
  workOrderMilestoneCompletionTimeString?: string
}

export async function completeWorkOrderMilestone(
  milestoneForm: CompleteWorkOrderMilestoneForm,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const rightNow = new Date()

  const database = await acquireConnection()

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
      (milestoneForm.workOrderMilestoneCompletionDateString ?? '') === ''
        ? dateToInteger(rightNow)
        : dateStringToInteger(
            milestoneForm.workOrderMilestoneCompletionDateString!
          ),
      (milestoneForm.workOrderMilestoneCompletionTimeString ?? '') === ''
        ? dateToTimeInteger(rightNow)
        : timeStringToInteger(
            milestoneForm.workOrderMilestoneCompletionTimeString!
          ),
      requestSession.user!.userName,
      rightNow.getTime(),
      milestoneForm.workOrderMilestoneId
    )

  database.release()

  return result.changes > 0
}

export default completeWorkOrderMilestone
