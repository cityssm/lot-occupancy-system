import { getSolidIconClasses } from '@cityssm/font-awesome-v5-iconclasses'
import type { Request, Response } from 'express'

import {
  getLotOccupantTypes,
  getLotStatuses,
  getWorkOrderMilestoneTypes,
  getWorkOrderTypes
} from '../../helpers/functions.cache.js'

export default async function handler(
  _request: Request,
  response: Response
): Promise<void> {
  const workOrderTypes = await getWorkOrderTypes()
  const workOrderMilestoneTypes = await getWorkOrderMilestoneTypes()
  const lotStatuses = await getLotStatuses()
  const lotOccupantTypes = await getLotOccupantTypes()

  const fontAwesomeIconClasses = await getSolidIconClasses()

  response.render('admin-tables', {
    headTitle: 'Config Table Management',
    workOrderTypes,
    workOrderMilestoneTypes,
    lotStatuses,
    lotOccupantTypes,
    fontAwesomeIconClasses
  })
}
