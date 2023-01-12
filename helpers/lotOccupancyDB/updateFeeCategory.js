import { updateRecord } from './updateRecord.js';
export function updateFeeCategory(feeCategoryForm, requestSession) {
    const success = updateRecord('FeeCategories', feeCategoryForm.feeCategoryId, feeCategoryForm.feeCategory, requestSession);
    return success;
}
export default updateFeeCategory;
