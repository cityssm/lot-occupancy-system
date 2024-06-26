import { acquireConnection } from './pool.js';
export default async function getLotOccupancyOccupants(lotOccupancyId, connectedDatabase) {
    const database = connectedDatabase ?? (await acquireConnection());
    const lotOccupancyOccupants = database
        .prepare(`select o.lotOccupancyId, o.lotOccupantIndex,
        o.occupantName, o.occupantFamilyName,
        o.occupantAddress1, o.occupantAddress2,
        o.occupantCity, o.occupantProvince, o.occupantPostalCode,
        o.occupantPhoneNumber, o.occupantEmailAddress,
        o.occupantComment,
        o.lotOccupantTypeId, t.lotOccupantType,
        t.fontAwesomeIconClass, t.occupantCommentTitle
        from LotOccupancyOccupants o
        left join LotOccupantTypes t on o.lotOccupantTypeId = t.lotOccupantTypeId
        where o.recordDelete_timeMillis is null
        and o.lotOccupancyId = ?
        order by t.orderNumber, t.lotOccupantType, o.occupantName, o.lotOccupantIndex`)
        .all(lotOccupancyId);
    if (connectedDatabase === undefined) {
        database.release();
    }
    return lotOccupancyOccupants;
}
