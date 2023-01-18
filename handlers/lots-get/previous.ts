import type { Request, Response } from 'express'

import * as configFunctions from '../../helpers/functions.config.js'

import { getPreviousLotId } from '../../helpers/lotOccupancyDB/getPreviousLotId.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const lotId = request.params.lotId

  const previousLotId = await getPreviousLotId(lotId)

  if (!previousLotId) {
    response.redirect(
      configFunctions.getProperty('reverseProxy.urlPrefix') +
        '/lots/?error=noPreviousLotIdFound'
    )
    return
  }

  response.redirect(
    configFunctions.getProperty('reverseProxy.urlPrefix') +
      '/lots/' +
      previousLotId
  )
}

export default handler
