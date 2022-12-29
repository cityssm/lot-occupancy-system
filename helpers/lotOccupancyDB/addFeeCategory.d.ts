import type * as recordTypes from "../../types/recordTypes";
interface AddFeeCategoryForm {
    feeCategory: string;
    orderNumber?: number;
}
export declare function addFeeCategory(feeCategoryForm: AddFeeCategoryForm, requestSession: recordTypes.PartialSession): number;
export default addFeeCategory;
