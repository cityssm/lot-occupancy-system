import { addRecord } from "./addRecord.js";
export function addFeeCategory(feeCategoryForm, requestSession) {
    const feeCategoryId = addRecord("FeeCategories", feeCategoryForm.feeCategory, feeCategoryForm.orderNumber || -1, requestSession);
    return feeCategoryId;
}
export default addFeeCategory;
