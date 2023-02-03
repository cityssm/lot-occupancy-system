import type { Request, Response } from 'express'

import { dateToString } from '@cityssm/expressjs-server-js/dateTimeFns.js'

import { getWorkOrderMilestones } from '../../helpers/lotOccupancyDB/getWorkOrderMilestones.js'
import { getWorkOrders } from '../../helpers/lotOccupancyDB/getWorkOrders.js'
import { getLotOccupancies } from '../../helpers/lotOccupancyDB/getLotOccupancies.js'

export async function handler(
  _request: Request,
  response: Response
): Promise<void> {
  const currentDateString = dateToString(new Date())

  const workOrderMilestones = await getWorkOrderMilestones(
    {
      workOrderMilestoneDateFilter: 'date',
      workOrderMilestoneDateString: currentDateString
    },
    {
      orderBy: 'completion',
      includeWorkOrders: true
    }
  )

  const workOrderResults = await getWorkOrders(
    {
      workOrderOpenDateString: currentDateString
    },
    {
      limit: 1, // only using the count
      offset: 0
    }
  )

  const lotOccupancyResults = await getLotOccupancies(
    {
      occupancyStartDateString: currentDateString
    },
    {
      limit: 1, // only using the count
      offset: 0,
      includeFees: false,
      includeOccupants: false,
      includeTransactions: false
    }
  )

  response.render('dashboard', {
    headTitle: 'Dashboard',
    workOrderMilestones,
    workOrderCount: workOrderResults.count,
    lotOccupancyCount: lotOccupancyResults.count
  })
}

export default handler
