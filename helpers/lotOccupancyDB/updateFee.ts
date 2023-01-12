import sqlite from 'better-sqlite3'

import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js'

import type * as recordTypes from '../../types/recordTypes'

interface UpdateFeeForm {
  feeId: string
  feeCategoryId: string
  feeName: string
  feeDescription: string
  occupancyTypeId: string
  lotTypeId: string
  feeAmount?: string
  feeFunction?: string
  taxAmount?: string
  taxPercentage?: string
  includeQuantity: '' | '1'
  quantityUnit?: string
  isRequired: '' | '1'
}

export function updateFee(
  feeForm: UpdateFeeForm,
  requestSession: recordTypes.PartialSession
): boolean {
  const database = sqlite(databasePath)

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `update Fees
        set feeCategoryId = ?,
        feeName = ?,
        feeDescription = ?,
        occupancyTypeId = ?,
        lotTypeId = ?,
        feeAmount = ?,
        feeFunction = ?,
        taxAmount = ?,
        taxPercentage = ?,
        includeQuantity = ?,
        quantityUnit = ?,
        isRequired = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where recordDelete_timeMillis is null
        and feeId = ?`
    )
    .run(
      feeForm.feeCategoryId,
      feeForm.feeName,
      feeForm.feeDescription,
      feeForm.occupancyTypeId === '' ? undefined : feeForm.occupancyTypeId,
      feeForm.lotTypeId === '' ? undefined : feeForm.lotTypeId,
      feeForm.feeAmount ?? undefined,
      feeForm.feeFunction ?? undefined,
      feeForm.taxAmount ?? undefined,
      feeForm.taxPercentage ?? undefined,
      feeForm.includeQuantity === '' ? 0 : 1,
      feeForm.quantityUnit,
      feeForm.isRequired === '' ? 0 : 1,
      requestSession.user!.userName,
      rightNowMillis,
      feeForm.feeId
    )

  database.close()

  return result.changes > 0
}

export default updateFee
