import { updateRecord } from "./updateRecord.js";

import type * as recordTypes from "../../types/recordTypes";

interface UpdateFeeCategoryForm {
    feeCategoryId: number | string;
    feeCategory: string;
}

export function updateFeeCategory(
    feeCategoryForm: UpdateFeeCategoryForm,
    requestSession: recordTypes.PartialSession
): boolean {
    const success = updateRecord(
        "FeeCategories",
        feeCategoryForm.feeCategoryId,
        feeCategoryForm.feeCategory,
        requestSession
    );
    return success;
}

export default updateFeeCategory;
