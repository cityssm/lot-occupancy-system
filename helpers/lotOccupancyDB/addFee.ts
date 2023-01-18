/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { acquireConnection } from './pool.js'

import type * as recordTypes from '../../types/recordTypes'

interface AddFeeForm {
  feeCategoryId: string
  feeName: string
  feeDescription: string
  occupancyTypeId: string
  lotTypeId: string
  feeAmount?: string
  feeFunction: string
  taxAmount?: string
  taxPercentage?: string
  includeQuantity: '' | '1'
  quantityUnit?: string
  isRequired: '' | '1'
  orderNumber?: number
}

export async function addFee(
  feeForm: AddFeeForm,
  requestSession: recordTypes.PartialSession
): Promise<number> {
  const database = await acquireConnection()

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `insert into Fees (
        feeCategoryId,
        feeName, feeDescription,
        occupancyTypeId, lotTypeId,
        feeAmount, feeFunction,
        taxAmount, taxPercentage,
        includeQuantity, quantityUnit,
        isRequired, orderNumber,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
      (feeForm.includeQuantity ?? '') === '' ? 0 : 1,
      feeForm.quantityUnit,
      (feeForm.isRequired ?? '') === '' ? 0 : 1,
      feeForm.orderNumber ?? -1,
      requestSession.user!.userName,
      rightNowMillis,
      requestSession.user!.userName,
      rightNowMillis
    )

  database.release()

  return result.lastInsertRowid as number
}

export default addFee
