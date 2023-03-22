import type { Request, Response } from 'express'

import * as dateTimeFunctions from '@cityssm/utils-datetime'

import { getMaps } from '../../helpers/lotOccupancyDB/getMaps.js'
import { getLotStatuses, getLotTypes } from '../../helpers/functions.cache.js'

export async function handler(_request: Request, response: Response): Promise<void> {
  const rightNow = new Date()

  const maps = await getMaps()
  const lotTypes = await getLotTypes()
  const lotStatuses = await getLotStatuses()

  response.render('report-search', {
    headTitle: 'Reports',
    todayDateString: dateTimeFunctions.dateToString(rightNow),
    maps,
    lotTypes,
    lotStatuses
  })
}

export default handler
