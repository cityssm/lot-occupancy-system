import type { PoolConnection } from 'better-sqlite-pool'

import {
  calculateFeeAmount,
  calculateTaxAmount
} from '../helpers/functions.fee.js'
import type { Fee, LotOccupancy } from '../types/recordTypes.js'

import getFee from './getFee.js'
import getLotOccupancy from './getLotOccupancy.js'
import { acquireConnection } from './pool.js'

export interface AddLotOccupancyFeeForm {
  lotOccupancyId: number | string
  feeId: number | string
  quantity: number | string
  feeAmount?: number | string
  taxAmount?: number | string
}

export default async function addLotOccupancyFee(
  lotOccupancyFeeForm: AddLotOccupancyFeeForm,
  user: User,
  connectedDatabase?: PoolConnection
): Promise<boolean> {
  const database = connectedDatabase ?? (await acquireConnection())

  const rightNowMillis = Date.now()

  // Calculate fee and tax (if not set)
  let feeAmount: number
  let taxAmount: number

  if ((lotOccupancyFeeForm.feeAmount ?? '') === '') {
    const lotOccupancy = (await getLotOccupancy(
      lotOccupancyFeeForm.lotOccupancyId
    )) as LotOccupancy

    const fee = (await getFee(lotOccupancyFeeForm.feeId)) as Fee

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

  try {
    // Check if record already exists
    const record = database
      .prepare(
        `select feeAmount, taxAmount, recordDelete_timeMillis
          from LotOccupancyFees
          where lotOccupancyId = ?
          and feeId = ?`
      )
      .get(lotOccupancyFeeForm.lotOccupancyId, lotOccupancyFeeForm.feeId) as
      | {
          feeAmount: number | null
          taxAmount: number | null
          recordDelete_timeMillis: number | null
        }
      | undefined

    if (record !== undefined) {
      if (record.recordDelete_timeMillis !== null) {
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

    return result.changes > 0
  } finally {
    if (connectedDatabase === undefined) {
      database.release()
    }
  }
}
