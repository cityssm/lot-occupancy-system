import type { RequestHandler } from 'express'

import * as configFunctions from '../../helpers/functions.config.js'

import { getLot } from '../../helpers/lotOccupancyDB/getLot.js'
import { getMaps } from '../../helpers/lotOccupancyDB/getMaps.js'
import * as cacheFunctions from '../../helpers/functions.cache.js'

export const handler: RequestHandler = (request, response) => {
  const lot = getLot(request.params.lotId)

  if (!lot) {
    response.redirect(
      configFunctions.getProperty('reverseProxy.urlPrefix') +
        '/lots/?error=lotIdNotFound'
    )
    return
  }

  const maps = getMaps()
  const lotTypes = cacheFunctions.getLotTypes()
  const lotStatuses = cacheFunctions.getLotStatuses()

  response.render('lot-edit', {
    headTitle: lot.lotName,
    lot,
    isCreate: false,
    maps,
    lotTypes,
    lotStatuses
  })
}

export default handler
