import type * as recordTypes from '../../types/recordTypes';
interface UpdateFeeForm {
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
export declare function updateFee(feeForm: UpdateFeeForm, requestSession: recordTypes.PartialSession): Promise<boolean>;
export default updateFee;
