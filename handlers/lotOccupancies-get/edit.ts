import type { Request, Response } from 'express'

import {
  getLotOccupantTypes,
  getLotStatuses,
  getLotTypes,
  getOccupancyTypePrintsById,
  getOccupancyTypes,
  getWorkOrderTypes
} from '../../helpers/functions.cache.js'
import * as configFunctions from '../../helpers/functions.config.js'
import { getLotOccupancy } from '../../helpers/lotOccupancyDB/getLotOccupancy.js'
import { getMaps } from '../../helpers/lotOccupancyDB/getMaps.js'

export async function handler(request: Request, response: Response): Promise<void> {
  const lotOccupancy = await getLotOccupancy(request.params.lotOccupancyId)

  if (lotOccupancy === undefined) {
    response.redirect(
      `${configFunctions.getProperty(
        'reverseProxy.urlPrefix'
      )}/lotOccupancies/?error=lotOccupancyIdNotFound`
    )
    return
  }

  const occupancyTypePrints = await getOccupancyTypePrintsById(
    lotOccupancy.occupancyTypeId!
  )

  const occupancyTypes = await getOccupancyTypes()
  const lotOccupantTypes = await getLotOccupantTypes()
  const lotTypes = await getLotTypes()
  const lotStatuses = await getLotStatuses()
  const maps = await getMaps()
  const workOrderTypes = await getWorkOrderTypes()

  response.render('lotOccupancy-edit', {
    headTitle: `${configFunctions.getProperty('aliases.occupancy')} Update`,
    lotOccupancy,
    occupancyTypePrints,

    occupancyTypes,
    lotOccupantTypes,
    lotTypes,
    lotStatuses,
    maps,
    workOrderTypes,

    isCreate: false
  })
}

export default handler
