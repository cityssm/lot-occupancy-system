import type { Request, Response } from 'express'

import * as configFunctions from '../../helpers/functions.config.js'
import { getPreviousMapId } from '../../helpers/lotOccupancyDB/getPreviousMapId.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const mapId = Number.parseInt(request.params.mapId, 10)

  const previousMapId = await getPreviousMapId(mapId)

  if (previousMapId === undefined) {
    response.redirect(
      configFunctions.getProperty('reverseProxy.urlPrefix') +
        '/maps/?error=noPreviousMapIdFound'
    )
    return
  }

  response.redirect(
    configFunctions.getProperty('reverseProxy.urlPrefix') +
      '/maps/' +
      previousMapId.toString()
  )
}

export default handler
