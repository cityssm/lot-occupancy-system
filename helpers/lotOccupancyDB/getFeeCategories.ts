import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { getFees } from "./getFees.js";
import { updateRecordOrderNumber } from "./updateRecordOrderNumber.js";

import type * as recordTypes from "../../types/recordTypes";

interface GetFeeCategoriesFilters {
    occupancyTypeId?: number | string;
    lotTypeId?: number | string;
}

interface GetFeeCategoriesOptions {
    includeFees?: boolean;
}

export function getFeeCategories(
    filters: GetFeeCategoriesFilters,
    options: GetFeeCategoriesOptions
): recordTypes.FeeCategory[] {
    const updateOrderNumbers = !(filters.lotTypeId || filters.occupancyTypeId) && options.includeFees;

    const database = sqlite(databasePath, {
        readonly: !updateOrderNumbers
    });

    let sqlWhereClause = " where recordDelete_timeMillis is null";

    const sqlParameters: unknown[] = [];

    if (filters.occupancyTypeId) {
        sqlWhereClause +=
            " and feeCategoryId in (" +
            "select feeCategoryId from Fees" +
            " where recordDelete_timeMillis is null" +
            " and (occupancyTypeId is null or occupancyTypeId = ?))";

        sqlParameters.push(filters.occupancyTypeId);
    }

    if (filters.lotTypeId) {
        sqlWhereClause +=
            " and feeCategoryId in (" +
            "select feeCategoryId from Fees" +
            " where recordDelete_timeMillis is null" +
            " and (lotTypeId is null or lotTypeId = ?))";

        sqlParameters.push(filters.lotTypeId);
    }

    const feeCategories: recordTypes.FeeCategory[] = database
        .prepare(
            "select feeCategoryId, feeCategory, orderNumber" +
                " from FeeCategories" +
                sqlWhereClause +
                " order by orderNumber, feeCategory"
        )
        .all(sqlParameters);

    if (options.includeFees) {
        let expectedOrderNumber = 0;

        for (const feeCategory of feeCategories) {
            if (updateOrderNumbers && feeCategory.orderNumber !== expectedOrderNumber) {
                updateRecordOrderNumber(
                    "FeeCategories",
                    feeCategory.feeCategoryId,
                    expectedOrderNumber,
                    database
                );

                feeCategory.orderNumber = expectedOrderNumber;
            }

            expectedOrderNumber += 1;

            feeCategory.fees = getFees(feeCategory.feeCategoryId, filters, database);
        }
    }

    database.close();

    return feeCategories;
}

export default getFeeCategories;
