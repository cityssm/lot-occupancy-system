import { updateRecord } from './updateRecord.js'

interface UpdateFeeCategoryForm {
  feeCategoryId: number | string
  feeCategory: string
}

export async function updateFeeCategory(
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

export default updateFeeCategory
