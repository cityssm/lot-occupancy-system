import { acquireConnection } from './pool.js';
export default async function getPastLotOccupancyOccupants(filters, options) {
    const database = await acquireConnection();
    let sqlWhereClause = ' where o.recordDelete_timeMillis is null and l.recordDelete_timeMillis is null';
    const sqlParameters = [];
    if (filters.searchFilter !== '') {
        const searchFilterPieces = filters.searchFilter.split(' ');
        for (const searchFilterPiece of searchFilterPieces) {
            if (searchFilterPiece === '') {
                continue;
            }
            sqlWhereClause += ` and (o.occupantName like '%' || ? || '%'
        or o.occupantFamilyName like '%' || ? || '%'
        or o.occupantAddress1 like '%' || ? || '%'
        or o.occupantAddress2 like '%' || ? || '%'
        or o.occupantCity like '%' || ? || '%')`;
            sqlParameters.push(searchFilterPiece, searchFilterPiece, searchFilterPiece, searchFilterPiece, searchFilterPiece);
        }
    }
    const sql = `select o.occupantName, o.occupantFamilyName,
      o.occupantAddress1, o.occupantAddress2,
      o.occupantCity, o.occupantProvince, o.occupantPostalCode,
      o.occupantPhoneNumber, o.occupantEmailAddress,
      count(*) as lotOccupancyIdCount,
      max(o.recordUpdate_timeMillis) as recordUpdate_timeMillisMax
    from LotOccupancyOccupants o
    left join LotOccupancies l on o.lotOccupancyId = l.lotOccupancyId
    ${sqlWhereClause}
    group by occupantName, occupantAddress1, occupantAddress2,
      occupantCity, occupantProvince, occupantPostalCode,
      occupantPhoneNumber, occupantEmailAddress
    order by lotOccupancyIdCount desc, recordUpdate_timeMillisMax desc
    limit ${options.limit}`;
    const lotOccupancyOccupants = database
        .prepare(sql)
        .all(sqlParameters);
    database.release();
    return lotOccupancyOccupants;
}
