import type { Request, Response } from 'express'

import getWorkOrder from '../../database/getWorkOrder.js'
import {
  getLotStatuses,
  getWorkOrderMilestoneTypes,
  getWorkOrderTypes
} from '../../helpers/functions.cache.js'
import { getConfigProperty } from '../../helpers/functions.config.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const workOrder = await getWorkOrder(request.params.workOrderId, {
    includeLotsAndLotOccupancies: true,
    includeComments: true,
    includeMilestones: true
  })

  if (workOrder === undefined) {
    response.redirect(
      `${getConfigProperty(
        'reverseProxy.urlPrefix'
      )}/workOrders/?error=workOrderIdNotFound`
    )
    return
  }

  if (workOrder.workOrderCloseDate) {
    response.redirect(
      `${getConfigProperty(
        'reverseProxy.urlPrefix'
      )}/workOrders/${workOrder.workOrderId.toString()}/?error=workOrderIsClosed`
    )
    return
  }

  const workOrderTypes = await getWorkOrderTypes()

  const workOrderMilestoneTypes = await getWorkOrderMilestoneTypes()

  const lotStatuses = await getLotStatuses()

  response.render('workOrder-edit', {
    headTitle: `Work Order #${workOrder.workOrderNumber}`,
    workOrder,
    isCreate: false,
    workOrderTypes,
    workOrderMilestoneTypes,
    lotStatuses
  })
}
