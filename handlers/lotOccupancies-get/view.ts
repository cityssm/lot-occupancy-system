import type { Request, Response } from 'express'

import { getLotOccupancy } from '../../database/getLotOccupancy.js'
import { getOccupancyTypePrintsById } from '../../helpers/functions.cache.js'
import * as configFunctions from '../../helpers/functions.config.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const lotOccupancy = await getLotOccupancy(request.params.lotOccupancyId)

  if (lotOccupancy === undefined) {
    response.redirect(
      `${configFunctions.getConfigProperty(
        'reverseProxy.urlPrefix'
      )}/lotOccupancies/?error=lotOccupancyIdNotFound`
    )
    return
  }

  const occupancyTypePrints = await getOccupancyTypePrintsById(
    lotOccupancy.occupancyTypeId
  )

  response.render('lotOccupancy-view', {
    headTitle: `${configFunctions.getConfigProperty('aliases.occupancy')} View`,
    lotOccupancy,
    occupancyTypePrints
  })
}

export default handler
