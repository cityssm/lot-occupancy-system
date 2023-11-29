import type { Request, Response } from 'express'

import * as configFunctions from '../../helpers/functions.config.js'
import { getMaps } from '../../helpers/lotOccupancyDB/getMaps.js'

export async function handler(_request: Request, response: Response): Promise<void> {
  const maps = await getMaps()

  response.render('map-search', {
    headTitle: configFunctions.getProperty('aliases.map') + ' Search',
    maps
  })
}

export default handler
