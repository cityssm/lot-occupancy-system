import { acquireConnection } from './pool.js'

export interface UpdateLotOccupancyFeeQuantityForm {
  lotOccupancyId: string | number
  feeId: string | number
  quantity: string | number
}

export default async function updateLotOccupancyFeeQuantity(
  feeQuantityForm: UpdateLotOccupancyFeeQuantityForm,
  user: User
): Promise<boolean> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `update LotOccupancyFees
        set quantity = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where recordDelete_timeMillis is null
        and lotOccupancyId = ?
        and feeId = ?`
    )
    .run(
      feeQuantityForm.quantity,
      user.userName,
      Date.now(),
      feeQuantityForm.lotOccupancyId,
      feeQuantityForm.feeId
    )

  database.release()

  return result.changes > 0
}
