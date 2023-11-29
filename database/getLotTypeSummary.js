import { acquireConnection } from './pool.js';
export async function getLotTypeSummary(filters) {
    const database = await acquireConnection();
    let sqlWhereClause = ' where l.recordDelete_timeMillis is null';
    const sqlParameters = [];
    if ((filters.mapId ?? '') !== '') {
        sqlWhereClause += ' and l.mapId = ?';
        sqlParameters.push(filters.mapId);
    }
    const lotTypes = database
        .prepare(`select t.lotTypeId, t.lotType, count(l.lotId) as lotCount
        from Lots l
        left join LotTypes t on l.lotTypeId = t.lotTypeId
        ${sqlWhereClause}
        group by t.lotTypeId, t.lotType, t.orderNumber
        order by t.orderNumber`)
        .all(sqlParameters);
    database.release();
    return lotTypes;
}
export default getLotTypeSummary;
