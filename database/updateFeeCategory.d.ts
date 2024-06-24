export interface UpdateFeeCategoryForm {
    feeCategoryId: number | string;
    feeCategory: string;
}
export default function updateFeeCategory(feeCategoryForm: UpdateFeeCategoryForm, user: User): Promise<boolean>;
