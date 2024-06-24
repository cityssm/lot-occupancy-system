import type { Request, Response } from 'express'

import getMaps from '../../database/getMaps.js'
import { getConfigProperty } from '../../helpers/functions.config.js'

export default async function handler(
  _request: Request,
  response: Response
): Promise<void> {
  const maps = await getMaps()

  response.render('map-search', {
    headTitle: `${getConfigProperty('aliases.map')} Search`,
    maps
  })
}
