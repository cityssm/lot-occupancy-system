import type { Request, Response } from 'express'

import * as cacheFunctions from '../../helpers/functions.cache.js'
import * as configFunctions from '../../helpers/functions.config.js'
import { getMaps } from '../../helpers/lotOccupancyDB/getMaps.js'
import type { Lot } from '../../types/recordTypes.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const lot: Lot = {
    lotId: -1,
    lotOccupancies: []
  }

  const maps = await getMaps()

  if (request.query.mapId !== undefined) {
    const mapId = Number.parseInt(request.query.mapId as string, 10)

    const map = maps.find((possibleMap) => {
      return mapId === possibleMap.mapId
    })

    if (map !== undefined) {
      lot.mapId = map.mapId
      lot.mapName = map.mapName
    }
  }

  const lotTypes = await cacheFunctions.getLotTypes()
  const lotStatuses = await cacheFunctions.getLotStatuses()

  response.render('lot-edit', {
    headTitle: 'Create a New ' + configFunctions.getProperty('aliases.lot'),
    lot,
    isCreate: true,
    maps,
    lotTypes,
    lotStatuses
  })
}

export default handler
