import type { Request, Response } from 'express'

import * as configFunctions from '../../helpers/functions.config.js'

import { getNextMapId } from '../../helpers/lotOccupancyDB/getNextMapId.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const mapId = Number.parseInt(request.params.mapId, 10)

  const nextMapId = await getNextMapId(mapId)

  if (nextMapId === undefined) {
    response.redirect(
      configFunctions.getProperty('reverseProxy.urlPrefix') +
        '/maps/?error=noNextMapIdFound'
    )
    return
  }

  response.redirect(
    configFunctions.getProperty('reverseProxy.urlPrefix') +
      '/maps/' +
      nextMapId.toString()
  )
}

export default handler
