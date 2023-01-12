import {
  dateToInteger,
  dateToString
} from '@cityssm/expressjs-server-js/dateTimeFns.js'
import type { RequestHandler } from 'express'

import { getWorkOrderTypes } from '../../helpers/functions.cache.js'

import * as recordTypes from '../../types/recordTypes'

export const handler: RequestHandler = (request, response) => {
  const currentDate = new Date()

  const workOrder: recordTypes.WorkOrder = {
    workOrderOpenDate: dateToInteger(currentDate),
    workOrderOpenDateString: dateToString(currentDate)
  }

  const workOrderTypes = getWorkOrderTypes()

  response.render('workOrder-edit', {
    headTitle: 'New Work Order',
    workOrder,
    isCreate: true,
    workOrderTypes
  })
}

export default handler
