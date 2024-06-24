import { updateRecord } from './updateRecord.js'

export interface UpdateFeeCategoryForm {
  feeCategoryId: number | string
  feeCategory: string
}

export default async function updateFeeCategory(
  feeCategoryForm: UpdateFeeCategoryForm,
  user: User
): Promise<boolean> {
  return await updateRecord(
    'FeeCategories',
    feeCategoryForm.feeCategoryId,
    feeCategoryForm.feeCategory,
    user
  )
}
