import type { Request, Response } from 'express'

import * as configFunctions from '../../helpers/functions.config.js'

import { getMaps } from '../../helpers/lotOccupancyDB/getMaps.js'

import {
  getLotTypes,
  getOccupancyTypes
} from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const maps = await getMaps()
  const lotTypes = await getLotTypes()
  const occupancyTypes = await getOccupancyTypes()

  response.render('lotOccupancy-search', {
    headTitle: configFunctions.getProperty('aliases.occupancy') + ' Search',
    maps,
    lotTypes,
    occupancyTypes,
    mapId: request.query.mapId
  })
}

export default handler
