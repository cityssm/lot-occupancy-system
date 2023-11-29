/* eslint-disable @typescript-eslint/indent */

import type { Request, Response } from 'express'

import {
  moveRecordDown,
  moveRecordDownToBottom
} from '../../database/moveRecord.js'
import { getWorkOrderMilestoneTypes } from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success =
    request.body.moveToEnd === '1'
      ? await moveRecordDownToBottom(
          'WorkOrderMilestoneTypes',
          request.body.workOrderMilestoneTypeId
        )
      : await moveRecordDown(
          'WorkOrderMilestoneTypes',
          request.body.workOrderMilestoneTypeId
        )

  const workOrderMilestoneTypes = await getWorkOrderMilestoneTypes()

  response.json({
    success,
    workOrderMilestoneTypes
  })
}

export default handler
