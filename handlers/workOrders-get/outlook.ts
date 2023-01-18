import type { Request, Response } from 'express'

import {
  getWorkOrderMilestoneTypes,
  getWorkOrderTypes
} from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const workOrderTypes = await getWorkOrderTypes()
  const workOrderMilestoneTypes = await getWorkOrderMilestoneTypes()

  response.render('workOrder-outlook', {
    headTitle: 'Work Order Outlook Integration',
    workOrderTypes,
    workOrderMilestoneTypes
  })
}

export default handler
