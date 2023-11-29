import type { Request, Response } from 'express'

import * as configFunctions from '../../helpers/functions.config.js'
import { getNextLotId, getPreviousLotId } from '../../helpers/functions.lots.js'
import { getLot } from '../../helpers/lotOccupancyDB/getLot.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const lot = await getLot(request.params.lotId)

  if (lot === undefined) {
    response.redirect(
      configFunctions.getProperty('reverseProxy.urlPrefix') +
        '/lots/?error=lotIdNotFound'
    )
    return
  }

  response.render('lot-view', {
    headTitle: lot.lotName,
    lot
  })

  response.on('finish', () => {
    void getNextLotId(lot.lotId)
    void getPreviousLotId(lot.lotId)
  })
}

export default handler
