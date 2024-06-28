import addLotOccupancyFee from './addLotOccupancyFee.js'
import { getFeeCategory } from './getFeeCategories.js'
import { acquireConnection } from './pool.js'

export interface AddLotOccupancyFeeCategoryForm {
  lotOccupancyId: number | string
  feeCategoryId: number | string
}

export default async function addLotOccupancyFeeCategory(
  lotOccupancyFeeCategoryForm: AddLotOccupancyFeeCategoryForm,
  user: User
): Promise<number> {
  const database = await acquireConnection()

  const feeCategory = await getFeeCategory(
    lotOccupancyFeeCategoryForm.feeCategoryId,
    database
  )

  let addedFeeCount = 0

  for (const fee of feeCategory?.fees ?? []) {
    const success = await addLotOccupancyFee(
      {
        lotOccupancyId: lotOccupancyFeeCategoryForm.lotOccupancyId,
        feeId: fee.feeId,
        quantity: 1
      },
      user,
      database
    )

    if (success) {
      addedFeeCount += 1
    }
  }

  database.release()

  return addedFeeCount
}
