import { addRecord } from "./addRecord.js";

import type * as recordTypes from "../../types/recordTypes";

interface AddFeeCategoryForm {
    feeCategory: string;
    orderNumber?: number;
}

export function addFeeCategory(
    feeCategoryForm: AddFeeCategoryForm,
    requestSession: recordTypes.PartialSession
): number {
    const feeCategoryId = addRecord(
        "FeeCategories",
        feeCategoryForm.feeCategory,
        feeCategoryForm.orderNumber || -1,
        requestSession
    );

    return feeCategoryId;
}

export default addFeeCategory;
