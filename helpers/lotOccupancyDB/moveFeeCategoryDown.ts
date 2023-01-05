import { moveRecordDown, moveRecordDownToBottom } from "./moveRecord.js";

export function moveFeeCategoryDown(feeCategoryId: number | string): boolean {
    const success = moveRecordDown("FeeCategories", feeCategoryId);
    return success;
}

export function moveFeeCategoryDownToBottom(feeCategoryId: number | string): boolean {
    const success = moveRecordDownToBottom("FeeCategories", feeCategoryId);
    return success;
}

export default moveFeeCategoryDown;
