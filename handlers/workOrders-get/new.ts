import {
  dateToInteger,
  dateToString
} from '@cityssm/expressjs-server-js/dateTimeFns.js'
import type { Request, Response } from 'express'

import { getWorkOrderTypes } from '../../helpers/functions.cache.js'

import * as recordTypes from '../../types/recordTypes'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const currentDate = new Date()

  const workOrder: recordTypes.WorkOrder = {
    workOrderOpenDate: dateToInteger(currentDate),
    workOrderOpenDateString: dateToString(currentDate)
  }

  const workOrderTypes = await getWorkOrderTypes()

  response.render('workOrder-edit', {
    headTitle: 'New Work Order',
    workOrder,
    isCreate: true,
    workOrderTypes
  })
}

export default handler
