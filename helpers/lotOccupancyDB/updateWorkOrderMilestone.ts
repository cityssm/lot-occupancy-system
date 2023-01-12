import sqlite from 'better-sqlite3'

import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js'

import {
  dateStringToInteger,
  timeStringToInteger
} from '@cityssm/expressjs-server-js/dateTimeFns.js'

import type * as recordTypes from '../../types/recordTypes'

interface UpdateWorkOrderMilestoneForm {
  workOrderMilestoneId: string | number
  workOrderMilestoneTypeId: number | string
  workOrderMilestoneDateString: string
  workOrderMilestoneTimeString?: string
  workOrderMilestoneDescription: string
}

export function updateWorkOrderMilestone(
  milestoneForm: UpdateWorkOrderMilestoneForm,
  requestSession: recordTypes.PartialSession
): boolean {
  const rightNow = new Date()

  const database = sqlite(databasePath)

  const result = database
    .prepare(
      `update WorkOrderMilestones
        set workOrderMilestoneTypeId = ?,
        workOrderMilestoneDate = ?,
        workOrderMilestoneTime = ?,
        workOrderMilestoneDescription = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where workOrderMilestoneId = ?`
    )
    .run(
      milestoneForm.workOrderMilestoneTypeId === '' ? undefined : milestoneForm.workOrderMilestoneTypeId,
      dateStringToInteger(milestoneForm.workOrderMilestoneDateString),
      milestoneForm.workOrderMilestoneTimeString
        ? timeStringToInteger(milestoneForm.workOrderMilestoneTimeString)
        : 0,
      milestoneForm.workOrderMilestoneDescription,

      requestSession.user!.userName,
      rightNow.getTime(),
      milestoneForm.workOrderMilestoneId
    )

  database.close()

  return result.changes > 0
}

export default updateWorkOrderMilestone
