import type { RequestHandler } from 'express'

import * as configFunctions from '../../helpers/functions.config.js'

import { getMaps } from '../../helpers/lotOccupancyDB/getMaps.js'

export const handler: RequestHandler = (_request, response) => {
  const maps = getMaps()

  response.render('map-search', {
    headTitle: configFunctions.getProperty('aliases.map') + ' Search',
    maps
  })
}

export default handler
