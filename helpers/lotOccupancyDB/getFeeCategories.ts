import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

interface GetFeeCategoriesFilters {
    occupancyTypeId?: number | string;
    lotTypeId?: number | string;
}

interface GetFeeCategoriesOptions {
    includeFees?: boolean;
}

const buildFeeCategoryWhereClause = (
    filters: GetFeeCategoriesFilters
): { sqlWhereClause: string; sqlParameters: unknown[] } => {
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

    return {
        sqlWhereClause,
        sqlParameters
    };
};

const buildFeeWhereClause = (
    filters: GetFeeCategoriesFilters,
    feeCategoryId: number
): { sqlWhereClause: string; sqlParameters: unknown[] } => {
    let sqlWhereClause = " where f.recordDelete_timeMillis is null" + " and f.feeCategoryId = ?";

    const sqlParameters: unknown[] = [];

    sqlParameters.push(feeCategoryId);

    if (filters.occupancyTypeId) {
        sqlWhereClause += " and (f.occupancyTypeId is null or f.occupancyTypeId = ?)";

        sqlParameters.push(filters.occupancyTypeId);
    }

    if (filters.lotTypeId) {
        sqlWhereClause += " and (f.lotTypeId is null or f.lotTypeId = ?)";

        sqlParameters.push(filters.lotTypeId);
    }

    return {
        sqlWhereClause,
        sqlParameters
    };
};

export const getFeeCategories = (
    filters: GetFeeCategoriesFilters,
    options: GetFeeCategoriesOptions
): recordTypes.FeeCategory[] => {
    const updateOrderNumbers =
        !(filters.lotTypeId || filters.occupancyTypeId) && options.includeFees;

    const database = sqlite(databasePath, {
        readonly: !updateOrderNumbers
    });

    const feeCategorySqlFilter = buildFeeCategoryWhereClause(filters);

    const feeCategories: recordTypes.FeeCategory[] = database
        .prepare(
            "select feeCategoryId, feeCategory, orderNumber" +
                " from FeeCategories" +
                feeCategorySqlFilter.sqlWhereClause +
                " order by orderNumber, feeCategory"
        )
        .all(feeCategorySqlFilter.sqlParameters);

    if (options.includeFees) {
        let expectedFeeCategoryOrderNumber = -1;

        for (const feeCategory of feeCategories) {
            expectedFeeCategoryOrderNumber += 1;

            if (updateOrderNumbers && feeCategory.orderNumber !== expectedFeeCategoryOrderNumber) {
                database
                    .prepare(
                        "update FeeCategories" + " set orderNumber = ?" + " where feeCategoryId = ?"
                    )
                    .run(expectedFeeCategoryOrderNumber, feeCategory.feeCategoryId);

                feeCategory.orderNumber = expectedFeeCategoryOrderNumber;
            }

            const feeSqlFilter = buildFeeWhereClause(filters, feeCategory.feeCategoryId as number);

            feeCategory.fees = database
                .prepare(
                    "select f.feeId, f.feeName, f.feeDescription," +
                        " f.occupancyTypeId, o.occupancyType," +
                        " f.lotTypeId, l.lotType," +
                        " ifnull(f.feeAmount, 0) as feeAmount, f.feeFunction," +
                        " f.taxAmount, f.taxPercentage," +
                        " f.includeQuantity, f.quantityUnit," +
                        " f.isRequired, f.orderNumber" +
                        " from Fees f" +
                        " left join OccupancyTypes o on f.occupancyTypeId = o.occupancyTypeId" +
                        " left join LotTypes l on f.lotTypeId = l.lotTypeId" +
                        feeSqlFilter.sqlWhereClause +
                        " order by f.orderNumber, f.feeName"
                )
                .all(feeSqlFilter.sqlParameters);

            if (updateOrderNumbers) {
                let expectedFeeOrderNumber = -1;

                for (const fee of feeCategory.fees) {
                    expectedFeeOrderNumber += 1;

                    if (fee.orderNumber !== expectedFeeOrderNumber) {
                        database
                            .prepare("update Fees" + " set orderNumber = ?" + " where feeId = ?")
                            .run(expectedFeeOrderNumber, fee.feeId);

                        fee.orderNumber = expectedFeeOrderNumber;
                    }
                }
            }
        }
    }

    database.close();

    return feeCategories;
};

export default getFeeCategories;
