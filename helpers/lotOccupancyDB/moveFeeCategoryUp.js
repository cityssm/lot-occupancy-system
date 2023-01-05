import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";
export function moveFeeCategoryUp(feeCategoryId) {
    const success = moveRecordUp("FeeCategories", feeCategoryId);
    return success;
}
export function moveFeeCategoryUpToTop(feeCategoryId) {
    const success = moveRecordUpToTop("FeeCategories", feeCategoryId);
    return success;
}
export default moveFeeCategoryUp;
