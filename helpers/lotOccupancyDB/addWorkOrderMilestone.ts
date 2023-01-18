/* eslint-disable @typescript-eslint/indent */

import sqlite from 'better-sqlite3'

import { acquireConnection } from './pool.js'

import {
  dateStringToInteger,
  timeStringToInteger
} from '@cityssm/expressjs-server-js/dateTimeFns.js'

import type * as recordTypes from '../../types/recordTypes'

interface AddWorkOrderMilestoneForm {
  workOrderId: string | number
  workOrderMilestoneTypeId?: number | string
  workOrderMilestoneDateString: string
  workOrderMilestoneTimeString?: string
  workOrderMilestoneDescription: string
  workOrderMilestoneCompletionDateString?: string
  workOrderMilestoneCompletionTimeString?: string
}

export async function addWorkOrderMilestone(
  milestoneForm: AddWorkOrderMilestoneForm,
  requestSession: recordTypes.PartialSession
): Promise<number> {
  const rightNow = new Date()

  const database = await acquireConnection()

  const result = database
    .prepare(
      `insert into WorkOrderMilestones (
        workOrderId, workOrderMilestoneTypeId,
        workOrderMilestoneDate, workOrderMilestoneTime,
        workOrderMilestoneDescription,
        workOrderMilestoneCompletionDate, workOrderMilestoneCompletionTime,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      milestoneForm.workOrderId,
      milestoneForm.workOrderMilestoneTypeId ?? undefined,
      dateStringToInteger(milestoneForm.workOrderMilestoneDateString),
      milestoneForm.workOrderMilestoneTimeString
        ? timeStringToInteger(milestoneForm.workOrderMilestoneTimeString)
        : 0,
      milestoneForm.workOrderMilestoneDescription,
      milestoneForm.workOrderMilestoneCompletionDateString
        ? dateStringToInteger(
            milestoneForm.workOrderMilestoneCompletionDateString
          )
        : undefined,
      milestoneForm.workOrderMilestoneCompletionTimeString
        ? timeStringToInteger(
            milestoneForm.workOrderMilestoneCompletionTimeString
          )
        : undefined,
      requestSession.user!.userName,
      rightNow.getTime(),
      requestSession.user!.userName,
      rightNow.getTime()
    )

  database.release()

  return result.lastInsertRowid as number
}

export default addWorkOrderMilestone
