import type * as recordTypes from "../../types/recordTypes";
interface AddFeeForm {
    feeCategoryId: string;
    feeName: string;
    feeDescription: string;
    occupancyTypeId?: string;
    lotTypeId?: string;
    feeAmount?: string;
    feeFunction?: string;
    taxAmount?: string;
    taxPercentage?: string;
    includeQuantity: "" | "1";
    quantityUnit?: string;
    isRequired: "" | "1";
    orderNumber?: number;
}
export declare function addFee(feeForm: AddFeeForm, requestSession: recordTypes.PartialSession): number;
export default addFee;
