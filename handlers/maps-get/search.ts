import type { Request, Response } from 'express'

import { getMaps } from '../../database/getMaps.js'
import * as configFunctions from '../../helpers/functions.config.js'

export async function handler(_request: Request, response: Response): Promise<void> {
  const maps = await getMaps()

  response.render('map-search', {
    headTitle: `${configFunctions.getProperty('aliases.map')} Search`,
    maps
  })
}

export default handler
