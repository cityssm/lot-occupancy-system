import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
interface UpdateFeeForm {
    feeId: string;
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
}
export declare const updateFee: (feeForm: UpdateFeeForm, requestSession: recordTypes.PartialSession) => boolean;
export declare const updateFeeOrderNumber: (feeId: number, orderNumber: number, connectedDatabase?: sqlite.Database) => boolean;
export default updateFee;
