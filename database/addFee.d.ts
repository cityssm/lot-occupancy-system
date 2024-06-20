export interface AddFeeForm {
    feeCategoryId: string;
    feeName: string;
    feeDescription: string;
    feeAccount: string;
    occupancyTypeId: string;
    lotTypeId: string;
    feeAmount?: string;
    feeFunction: string;
    taxAmount?: string;
    taxPercentage?: string;
    includeQuantity: '' | '1';
    quantityUnit?: string;
    isRequired: '' | '1';
    orderNumber?: number;
}
export default function addFee(feeForm: AddFeeForm, user: User): Promise<number>;
