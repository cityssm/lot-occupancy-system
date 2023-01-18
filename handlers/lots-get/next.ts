import type { Request, Response } from 'express'

import * as configFunctions from '../../helpers/functions.config.js'

import { getNextLotId } from '../../helpers/lotOccupancyDB/getNextLotId.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const lotId = request.params.lotId

  const nextLotId = await getNextLotId(lotId)

  if (!nextLotId) {
    response.redirect(
      configFunctions.getProperty('reverseProxy.urlPrefix') +
        '/lots/?error=noNextLotIdFound'
    )
    return
  }

  response.redirect(
    configFunctions.getProperty('reverseProxy.urlPrefix') + '/lots/' + nextLotId
  )
}

export default handler
