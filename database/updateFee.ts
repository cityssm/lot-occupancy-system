import { acquireConnection } from './pool.js'

interface UpdateFeeForm {
  feeId: string
  feeCategoryId: string
  feeName: string
  feeDescription: string
  feeAccount: string
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

export async function updateFee(
  feeForm: UpdateFeeForm,
  user: User
): Promise<boolean> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `update Fees
        set feeCategoryId = ?,
        feeName = ?,
        feeDescription = ?,
        feeAccount = ?,
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
      feeForm.feeAccount,
      feeForm.occupancyTypeId === '' ? undefined : feeForm.occupancyTypeId,
      feeForm.lotTypeId === '' ? undefined : feeForm.lotTypeId,
      feeForm.feeAmount === undefined || feeForm.feeAmount === ''
        ? 0
        : feeForm.feeAmount,
      feeForm.feeFunction ?? undefined,
      feeForm.taxAmount ?? undefined,
      feeForm.taxPercentage ?? undefined,
      feeForm.includeQuantity === '' ? 0 : 1,
      feeForm.quantityUnit,
      feeForm.isRequired === '' ? 0 : 1,
      user.userName,
      Date.now(),
      feeForm.feeId
    )

  database.release()

  return result.changes > 0
}

export default updateFee
