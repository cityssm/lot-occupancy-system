import { updateRecord } from './updateRecord.js'

import type * as recordTypes from '../../types/recordTypes'

interface UpdateFeeCategoryForm {
  feeCategoryId: number | string
  feeCategory: string
}

export async function updateFeeCategory(
  feeCategoryForm: UpdateFeeCategoryForm,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const success = await updateRecord(
    'FeeCategories',
    feeCategoryForm.feeCategoryId,
    feeCategoryForm.feeCategory,
    requestSession
  )
  return success
}

export default updateFeeCategory
