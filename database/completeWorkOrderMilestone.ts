import {
  dateStringToInteger,
  dateToInteger,
  dateToTimeInteger,
  timeStringToInteger
} from '@cityssm/utils-datetime'

import { acquireConnection } from './pool.js'

export interface CompleteWorkOrderMilestoneForm {
  workOrderMilestoneId: string | number
  workOrderMilestoneCompletionDateString?: string
  workOrderMilestoneCompletionTimeString?: string
}

export default async function completeWorkOrderMilestone(
  milestoneForm: CompleteWorkOrderMilestoneForm,
  user: User
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
      user.userName,
      rightNow.getTime(),
      milestoneForm.workOrderMilestoneId
    )

  database.release()

  return result.changes > 0
}
