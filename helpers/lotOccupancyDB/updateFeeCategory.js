import { updateRecord } from './updateRecord.js';
export async function updateFeeCategory(feeCategoryForm, requestSession) {
    const success = await updateRecord('FeeCategories', feeCategoryForm.feeCategoryId, feeCategoryForm.feeCategory, requestSession);
    return success;
}
export default updateFeeCategory;
