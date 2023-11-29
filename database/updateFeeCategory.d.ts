interface UpdateFeeCategoryForm {
    feeCategoryId: number | string;
    feeCategory: string;
}
export declare function updateFeeCategory(feeCategoryForm: UpdateFeeCategoryForm, user: User): Promise<boolean>;
export default updateFeeCategory;
