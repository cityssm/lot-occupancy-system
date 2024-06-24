import type { Request, Response } from 'express'

import { getMaps } from '../../database/getMaps.js'
import { getLotTypes, getLotStatuses } from '../../helpers/functions.cache.js'
import * as configFunctions from '../../helpers/functions.config.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const maps = await getMaps()
  const lotTypes = await getLotTypes()
  const lotStatuses = await getLotStatuses()

  response.render('lot-search', {
    headTitle: `${configFunctions.getConfigProperty('aliases.lot')} Search`,
    maps,
    lotTypes,
    lotStatuses,
    mapId: request.query.mapId,
    lotTypeId: request.query.lotTypeId,
    lotStatusId: request.query.lotStatusId
  })
}

