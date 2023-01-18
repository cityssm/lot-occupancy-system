import type { Request, Response } from 'express'

import {
  getLotTypes,
  getOccupancyTypes
} from '../../helpers/functions.cache.js'

import { getFeeCategories } from '../../helpers/lotOccupancyDB/getFeeCategories.js'

export async function handler(
  _request: Request,
  response: Response
): Promise<void> {
  const feeCategories = await getFeeCategories(
    {},
    {
      includeFees: true
    }
  )

  const occupancyTypes = await getOccupancyTypes()
  const lotTypes = await getLotTypes()

  response.render('admin-fees', {
    headTitle: 'Fee Management',
    feeCategories,
    occupancyTypes,
    lotTypes
  })
}

export default handler
