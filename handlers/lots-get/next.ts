import type { Request, Response } from 'express'

import { getConfigProperty } from '../../helpers/functions.config.js'
import { getNextLotId } from '../../helpers/functions.lots.js'

export default async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const lotId = Number.parseInt(request.params.lotId, 10)

  const nextLotId = await getNextLotId(lotId)

  if (nextLotId === undefined) {
    response.redirect(
      `${getConfigProperty(
        'reverseProxy.urlPrefix'
      )}/lots/?error=noNextLotIdFound`
    )
    return
  }

  response.redirect(
    `${getConfigProperty(
      'reverseProxy.urlPrefix'
    )}/lots/${nextLotId.toString()}`
  )
}
