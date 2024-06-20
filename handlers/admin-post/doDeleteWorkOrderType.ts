import type { Request, Response } from 'express'

import { deleteRecord } from '../../database/deleteRecord.js'
import { getWorkOrderTypes } from '../../helpers/functions.cache.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const success = await deleteRecord(
    'WorkOrderTypes',
    request.body.workOrderTypeId as string,
    request.session.user as User
  )

  const workOrderTypes = await getWorkOrderTypes()

  response.json({
    success,
    workOrderTypes
  })
}

export default handler
