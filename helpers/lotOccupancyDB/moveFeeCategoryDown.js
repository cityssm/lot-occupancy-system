import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";
export function moveFeeCategoryDown(feeCategoryId) {
    const success = moveRecordDown("FeeCategories", feeCategoryId);
    return success;
}
export function moveFeeCategoryDownToBottom(feeCategoryId) {
    const success = moveRecordDownToBottom("FeeCategories", feeCategoryId);
    return success;
}
export default moveFeeCategoryDown;
