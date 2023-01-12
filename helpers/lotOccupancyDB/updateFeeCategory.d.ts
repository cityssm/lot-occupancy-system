import type * as recordTypes from '../../types/recordTypes';
interface UpdateFeeCategoryForm {
    feeCategoryId: number | string;
    feeCategory: string;
}
export declare function updateFeeCategory(feeCategoryForm: UpdateFeeCategoryForm, requestSession: recordTypes.PartialSession): boolean;
export default updateFeeCategory;
