import type { Request, Response } from 'express'

import * as configFunctions from '../../helpers/functions.config.js'
import { getWorkOrder } from '../../database/getWorkOrder.js'

export async function handler(
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
      `${configFunctions.getProperty(
        'reverseProxy.urlPrefix'
      )}/workOrders/?error=workOrderIdNotFound`
    )
    return
  }

  response.render('workOrder-view', {
    headTitle: `Work Order #${workOrder.workOrderNumber!}`,
    workOrder
  })
}

export default handler
