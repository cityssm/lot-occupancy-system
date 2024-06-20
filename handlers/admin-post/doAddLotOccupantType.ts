import type { Request, Response } from 'express'

import addLotOccupantType, {
  type AddLotOccupantTypeForm
} from '../../database/addLotOccupantType.js'
import { getLotOccupantTypes } from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const lotOccupantTypeId = await addLotOccupantType(
    request.body as AddLotOccupantTypeForm,
    request.session.user as User
  )

  const lotOccupantTypes = await getLotOccupantTypes()

  response.json({
    success: true,
    lotOccupantTypeId,
    lotOccupantTypes
  })
}

export default handler
