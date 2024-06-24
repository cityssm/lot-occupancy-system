import { updateRecord } from './updateRecord.js';
export default async function updateFeeCategory(feeCategoryForm, user) {
    return await updateRecord('FeeCategories', feeCategoryForm.feeCategoryId, feeCategoryForm.feeCategory, user);
}
