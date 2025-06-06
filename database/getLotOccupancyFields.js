import { acquireConnection } from './pool.js';
export default async function getLotOccupancyFields(lotOccupancyId, connectedDatabase) {
    const database = connectedDatabase ?? (await acquireConnection());
    const lotOccupancyFields = database
        .prepare(`select o.lotOccupancyId, o.occupancyTypeFieldId,
        o.lotOccupancyFieldValue, f.occupancyTypeField, f.fieldType, f.occupancyTypeFieldValues,
        f.isRequired, f.pattern, f.minimumLength, f.maximumLength,
        f.orderNumber, t.orderNumber as occupancyTypeOrderNumber
        from LotOccupancyFields o
        left join OccupancyTypeFields f on o.occupancyTypeFieldId = f.occupancyTypeFieldId
        left join OccupancyTypes t on f.occupancyTypeId = t.occupancyTypeId
        where o.recordDelete_timeMillis is null
        and o.lotOccupancyId = ?
        
        union
        
        select ? as lotOccupancyId, f.occupancyTypeFieldId,
        '' as lotOccupancyFieldValue, f.occupancyTypeField, f.fieldType, f.occupancyTypeFieldValues,
        f.isRequired, f.pattern, f.minimumLength, f.maximumLength,
        f.orderNumber, t.orderNumber as occupancyTypeOrderNumber
        from OccupancyTypeFields f
        left join OccupancyTypes t on f.occupancyTypeId = t.occupancyTypeId
        where f.recordDelete_timeMillis is null and (
          f.occupancyTypeId is null
          or f.occupancyTypeId in (select occupancyTypeId from LotOccupancies where lotOccupancyId = ?))
        and f.occupancyTypeFieldId not in (select occupancyTypeFieldId from LotOccupancyFields where lotOccupancyId = ? and recordDelete_timeMillis is null)
        order by occupancyTypeOrderNumber, f.orderNumber, f.occupancyTypeField`)
        .all(lotOccupancyId, lotOccupancyId, lotOccupancyId, lotOccupancyId);
    if (connectedDatabase === undefined) {
        database.release();
    }
    return lotOccupancyFields;
}
