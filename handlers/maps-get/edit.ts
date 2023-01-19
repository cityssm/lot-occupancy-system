import type { Request, Response } from 'express'

import * as configFunctions from '../../helpers/functions.config.js'

import { getMap } from '../../helpers/lotOccupancyDB/getMap.js'

import { getMapSVGs } from '../../helpers/functions.map.js'
import { getLotTypeSummary } from '../../helpers/lotOccupancyDB/getLotTypeSummary.js'
import { getLotStatusSummary } from '../../helpers/lotOccupancyDB/getLotStatusSummary.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const map = await getMap(request.params.mapId)

  if (map === undefined) {
    response.redirect(
      configFunctions.getProperty('reverseProxy.urlPrefix') +
        '/maps/?error=mapIdNotFound'
    )
    return
  }

  const mapSVGs = await getMapSVGs()

  const lotTypeSummary = await getLotTypeSummary({
    mapId: map.mapId
  })

  const lotStatusSummary = await getLotStatusSummary({
    mapId: map.mapId
  })

  response.render('map-edit', {
    headTitle: map.mapName,
    isCreate: false,
    map,
    mapSVGs,
    lotTypeSummary,
    lotStatusSummary
  })
}

export default handler
