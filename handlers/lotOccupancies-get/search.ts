import type { Request, Response } from 'express'

import { getMaps } from '../../database/getMaps.js'
import {
  getLotTypes,
  getOccupancyTypes
} from '../../helpers/functions.cache.js'
import * as configFunctions from '../../helpers/functions.config.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const maps = await getMaps()
  const lotTypes = await getLotTypes()
  const occupancyTypes = await getOccupancyTypes()

  response.render('lotOccupancy-search', {
    headTitle: `${configFunctions.getProperty('aliases.occupancy')} Search`,
    maps,
    lotTypes,
    occupancyTypes,
    mapId: request.query.mapId
  })
}

export default handler
