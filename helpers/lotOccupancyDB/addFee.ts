import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

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

export function addFee(feeForm: AddFeeForm, requestSession: recordTypes.PartialSession): number {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            `insert into Fees (
                feeCategoryId,
                feeName, feeDescription,
                occupancyTypeId, lotTypeId,
                feeAmount, feeFunction,
                taxAmount, taxPercentage,
                includeQuantity, quantityUnit,
                isRequired, orderNumber,
                recordCreate_userName, recordCreate_timeMillis,
                recordUpdate_userName, recordUpdate_timeMillis)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
            feeForm.feeCategoryId,
            feeForm.feeName,
            feeForm.feeDescription,
            feeForm.occupancyTypeId || undefined,
            feeForm.lotTypeId || undefined,
            feeForm.feeAmount || undefined,
            feeForm.feeFunction || undefined,
            feeForm.taxAmount || undefined,
            feeForm.taxPercentage || undefined,
            feeForm.includeQuantity ? 1 : 0,
            feeForm.quantityUnit,
            feeForm.isRequired ? 1 : 0,
            feeForm.orderNumber || -1,
            requestSession.user.userName,
            rightNowMillis,
            requestSession.user.userName,
            rightNowMillis
        );

    database.close();

    return result.lastInsertRowid as number;
}

export default addFee;
