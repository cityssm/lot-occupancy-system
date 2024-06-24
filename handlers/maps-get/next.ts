import type { Request, Response } from 'express'

import { getNextMapId } from '../../database/getNextMapId.js'
import * as configFunctions from '../../helpers/functions.config.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const mapId = Number.parseInt(request.params.mapId, 10)

  const nextMapId = await getNextMapId(mapId)

  if (nextMapId === undefined) {
    response.redirect(
      `${configFunctions.getConfigProperty(
        'reverseProxy.urlPrefix'
      )}/maps/?error=noNextMapIdFound`
    )
    return
  }

  response.redirect(
    `${configFunctions.getConfigProperty(
      'reverseProxy.urlPrefix'
    )}/maps/${nextMapId.toString()}`
  )
}

