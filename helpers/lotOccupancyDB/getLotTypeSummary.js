import sqlite from 'better-sqlite3';
import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js';
export function getLotTypeSummary(filters) {
    const database = sqlite(databasePath, {
        readonly: true
    });
    let sqlWhereClause = ' where l.recordDelete_timeMillis is null';
    const sqlParameters = [];
    if (filters?.mapId) {
        sqlWhereClause += ' and l.mapId = ?';
        sqlParameters.push(filters.mapId);
    }
    const lotTypes = database
        .prepare('select t.lotTypeId, t.lotType, count(l.lotId) as lotCount' +
        ' from Lots l' +
        ' left join LotTypes t on l.lotTypeId = t.lotTypeId' +
        sqlWhereClause +
        ' group by t.lotTypeId, t.lotType, t.orderNumber' +
        ' order by t.orderNumber')
        .all(sqlParameters);
    database.close();
    return lotTypes;
}
export default getLotTypeSummary;
