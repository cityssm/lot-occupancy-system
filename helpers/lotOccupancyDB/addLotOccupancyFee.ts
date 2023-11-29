import type { LotOccupancy } from '../../types/recordTypes.js'
import { calculateFeeAmount, calculateTaxAmount } from '../functions.fee.js'

import { getFee } from './getFee.js'
import { getLotOccupancy } from './getLotOccupancy.js'
import { acquireConnection } from './pool.js'

interface AddLotOccupancyFeeForm {
  lotOccupancyId: number | string
  feeId: number | string
  quantity: number | string
  feeAmount?: number | string
  taxAmount?: number | string
}

export async function addLotOccupancyFee(
  lotOccupancyFeeForm: AddLotOccupancyFeeForm,
  user: User
): Promise<boolean> {
  const database = await acquireConnection()

  const rightNowMillis = Date.now()

  // Calculate fee and tax (if not set)
  let feeAmount: number
  let taxAmount: number

  if ((lotOccupancyFeeForm.feeAmount ?? '') === '') {
    const lotOccupancy = (await getLotOccupancy(
      lotOccupancyFeeForm.lotOccupancyId
    )) as LotOccupancy

    const fee = await getFee(lotOccupancyFeeForm.feeId)

    feeAmount = calculateFeeAmount(fee, lotOccupancy)
    taxAmount = calculateTaxAmount(fee, feeAmount)
  } else {
    feeAmount =
      typeof lotOccupancyFeeForm.feeAmount === 'string'
        ? Number.parseFloat(lotOccupancyFeeForm.feeAmount)
        : 0
    taxAmount =
      typeof lotOccupancyFeeForm.taxAmount === 'string'
        ? Number.parseFloat(lotOccupancyFeeForm.taxAmount)
        : 0
  }

  // Check if record already exists
  const record = database
    .prepare(
      `select feeAmount, taxAmount, recordDelete_timeMillis
        from LotOccupancyFees
        where lotOccupancyId = ?
        and feeId = ?`
    )
    .get(lotOccupancyFeeForm.lotOccupancyId, lotOccupancyFeeForm.feeId) as {
    feeAmount?: number
    taxAmount?: number
    recordDelete_timeMillis?: number
  }

  if (record) {
    if (record.recordDelete_timeMillis) {
      database
        .prepare(
          `delete from LotOccupancyFees
            where recordDelete_timeMillis is not null
            and lotOccupancyId = ?
            and feeId = ?`
        )
        .run(lotOccupancyFeeForm.lotOccupancyId, lotOccupancyFeeForm.feeId)
    } else if (
      record.feeAmount === feeAmount &&
      record.taxAmount === taxAmount
    ) {
      database
        .prepare(
          `update LotOccupancyFees
            set quantity = quantity + ?,
            recordUpdate_userName = ?,
            recordUpdate_timeMillis = ?
            where lotOccupancyId = ?
            and feeId = ?`
        )
        .run(
          lotOccupancyFeeForm.quantity,
          user.userName,
          rightNowMillis,
          lotOccupancyFeeForm.lotOccupancyId,
          lotOccupancyFeeForm.feeId
        )

      database.release()

      return true
    } else {
      const quantity =
        typeof lotOccupancyFeeForm.quantity === 'string'
          ? Number.parseFloat(lotOccupancyFeeForm.quantity)
          : lotOccupancyFeeForm.quantity

      database
        .prepare(
          `update LotOccupancyFees
            set feeAmount = (feeAmount * quantity) + ?,
            taxAmount = (taxAmount * quantity) + ?,
            quantity = 1,
            recordUpdate_userName = ?,
            recordUpdate_timeMillis = ?
            where lotOccupancyId = ?
            and feeId = ?`
        )
        .run(
          feeAmount * quantity,
          taxAmount * quantity,
          user.userName,
          rightNowMillis,
          lotOccupancyFeeForm.lotOccupancyId,
          lotOccupancyFeeForm.feeId
        )

      database.release()

      return true
    }
  }

  // Create new record
  const result = database
    .prepare(
      `insert into LotOccupancyFees (
        lotOccupancyId, feeId,
        quantity, feeAmount, taxAmount,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      lotOccupancyFeeForm.lotOccupancyId,
      lotOccupancyFeeForm.feeId,
      lotOccupancyFeeForm.quantity,
      feeAmount,
      taxAmount,
      user.userName,
      rightNowMillis,
      user.userName,
      rightNowMillis
    )

  database.release()

  return result.changes > 0
}

export default addLotOccupancyFee
