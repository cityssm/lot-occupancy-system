import type { Request, Response } from 'express'

import { getLot } from '../../database/getLot.js'
import { getMaps } from '../../database/getMaps.js'
import * as cacheFunctions from '../../helpers/functions.cache.js'
import * as configFunctions from '../../helpers/functions.config.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const lot = await getLot(request.params.lotId)

  if (lot === undefined) {
    response.redirect(
      configFunctions.getProperty('reverseProxy.urlPrefix') +
        '/lots/?error=lotIdNotFound'
    )
    return
  }

  const maps = await getMaps()
  const lotTypes = await cacheFunctions.getLotTypes()
  const lotStatuses = await cacheFunctions.getLotStatuses()

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
