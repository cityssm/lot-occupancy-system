import { acquireConnection } from './pool.js';
export default async function getFee(feeId, connectedDatabase) {
    const database = connectedDatabase ?? (await acquireConnection());
    const fee = database
        .prepare(`select f.feeId,
        f.feeCategoryId, c.feeCategory,
        f.feeName, f.feeDescription, f.feeAccount,
        f.occupancyTypeId, o.occupancyType,
        f.lotTypeId, l.lotType,
        ifnull(f.feeAmount, 0) as feeAmount, f.feeFunction,
        f.taxAmount, f.taxPercentage,
        f.includeQuantity, f.quantityUnit,
        f.isRequired, f.orderNumber
        from Fees f
        left join FeeCategories c on f.feeCategoryId = c.feeCategoryId
        left join OccupancyTypes o on f.occupancyTypeId = o.occupancyTypeId
        left join LotTypes l on f.lotTypeId = l.lotTypeId
        where f.recordDelete_timeMillis is null
        and f.feeId = ?`)
        .get(feeId);
    if (connectedDatabase === undefined) {
        database.release();
    }
    return fee;
}
