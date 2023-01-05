import { moveRecordUp, moveRecordUpToTop } from "./moveRecord.js";

export function moveFeeCategoryUp(feeCategoryId: number | string): boolean {
    const success = moveRecordUp("FeeCategories", feeCategoryId);
    return success;
}

export function moveFeeCategoryUpToTop(feeCategoryId: number | string): boolean {
    const success = moveRecordUpToTop("FeeCategories", feeCategoryId);
    return success;
}

export default moveFeeCategoryUp;
