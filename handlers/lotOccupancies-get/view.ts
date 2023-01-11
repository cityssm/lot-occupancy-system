import type { RequestHandler } from 'express'
import { getOccupancyTypePrintsById } from '../../helpers/functions.cache.js'

import * as configFunctions from '../../helpers/functions.config.js'

import { getLotOccupancy } from '../../helpers/lotOccupancyDB/getLotOccupancy.js'

export const handler: RequestHandler = (request, response) => {
  const lotOccupancy = getLotOccupancy(request.params.lotOccupancyId)

  if (!lotOccupancy) {
    response.redirect(
      configFunctions.getProperty('reverseProxy.urlPrefix') +
        '/lotOccupancies/?error=lotOccupancyIdNotFound'
    )
    return
  }

  const occupancyTypePrints = getOccupancyTypePrintsById(
    lotOccupancy.occupancyTypeId!
  )

  response.render('lotOccupancy-view', {
    headTitle: `${configFunctions.getProperty('aliases.occupancy')} View`,
    lotOccupancy,
    occupancyTypePrints
  })
}

export default handler
