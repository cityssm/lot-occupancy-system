export interface UpdateFeeForm {
    feeId: string;
    feeCategoryId: string;
    feeName: string;
    feeDescription: string;
    feeAccount: string;
    occupancyTypeId: string;
    lotTypeId: string;
    feeAmount?: string;
    feeFunction?: string;
    taxAmount?: string;
    taxPercentage?: string;
    includeQuantity: '' | '1';
    quantityUnit?: string;
    isRequired: '' | '1';
}
export default function updateFee(feeForm: UpdateFeeForm, user: User): Promise<boolean>;
export interface UpdateFeeAmountForm {
    feeId: string;
    feeAmount: string;
}
export declare function updateFeeAmount(feeAmountForm: UpdateFeeAmountForm, user: User): Promise<boolean>;
