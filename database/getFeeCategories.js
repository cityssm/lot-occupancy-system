import getFees from './getFees.js';
import { acquireConnection } from './pool.js';
import { updateRecordOrderNumber } from './updateRecordOrderNumber.js';
export default async function getFeeCategories(filters, options, connectedDatabase) {
    const updateOrderNumbers = !(filters.lotTypeId || filters.occupancyTypeId) && options.includeFees;
    const database = await acquireConnection();
    let sqlWhereClause = ' where recordDelete_timeMillis is null';
    const sqlParameters = [];
    if ((filters.occupancyTypeId ?? '') !== '') {
        sqlWhereClause += ` and feeCategoryId in (
        select feeCategoryId from Fees where recordDelete_timeMillis is null and (occupancyTypeId is null or occupancyTypeId = ?))`;
        sqlParameters.push(filters.occupancyTypeId);
    }
    if ((filters.lotTypeId ?? '') !== '') {
        sqlWhereClause += ` and feeCategoryId in (
        select feeCategoryId from Fees where recordDelete_timeMillis is null and (lotTypeId is null or lotTypeId = ?))`;
        sqlParameters.push(filters.lotTypeId);
    }
    const feeCategories = database
        .prepare(`select feeCategoryId, feeCategory, isGroupedFee, orderNumber
        from FeeCategories
        ${sqlWhereClause}
        order by orderNumber, feeCategory`)
        .all(sqlParameters);
    if (options.includeFees ?? false) {
        let expectedOrderNumber = 0;
        for (const feeCategory of feeCategories) {
            if (updateOrderNumbers &&
                feeCategory.orderNumber !== expectedOrderNumber) {
                updateRecordOrderNumber('FeeCategories', feeCategory.feeCategoryId, expectedOrderNumber, database);
                feeCategory.orderNumber = expectedOrderNumber;
            }
            expectedOrderNumber += 1;
            feeCategory.fees = await getFees(feeCategory.feeCategoryId, filters, database);
        }
    }
    if (connectedDatabase === undefined) {
        database.release();
    }
    return feeCategories;
}
export async function getFeeCategory(feeCategoryId, connectedDatabase) {
    const feeCategories = await getFeeCategories({
        feeCategoryId
    }, {
        includeFees: true
    }, connectedDatabase);
    if (feeCategories.length > 0) {
        return feeCategories[0];
    }
    return undefined;
}
