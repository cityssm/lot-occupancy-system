import { updateRecord } from './updateRecord.js';
export async function updateFeeCategory(feeCategoryForm, user) {
    return await updateRecord('FeeCategories', feeCategoryForm.feeCategoryId, feeCategoryForm.feeCategory, user);
}
export default updateFeeCategory;
