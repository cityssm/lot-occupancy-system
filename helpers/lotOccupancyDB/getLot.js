import { acquireConnection } from './pool.js';
import { getLotFields } from './getLotFields.js';
import { getLotComments } from './getLotComments.js';
import { getLotOccupancies } from './getLotOccupancies.js';
const baseSQL = `select l.lotId, l.lotTypeId, t.lotType, l.lotName, l.lotStatusId, s.lotStatus,
    l.mapId, m.mapName, m.mapSVG, l.mapKey,
    l.lotLatitude, l.lotLongitude
    from Lots l
    left join LotTypes t on l.lotTypeId = t.lotTypeId
    left join LotStatuses s on l.lotStatusId = s.lotStatusId
    left join Maps m on l.mapId = m.mapId
    where l.recordDelete_timeMillis is null`;
async function _getLot(sql, lotIdOrLotName) {
    const database = await acquireConnection();
    const lot = database.prepare(sql).get(lotIdOrLotName);
    if (lot !== undefined) {
        const lotOccupancies = await getLotOccupancies({
            lotId: lot.lotId
        }, {
            includeOccupants: true,
            limit: -1,
            offset: 0
        }, database);
        lot.lotOccupancies = lotOccupancies.lotOccupancies;
        lot.lotFields = await getLotFields(lot.lotId, database);
        lot.lotComments = await getLotComments(lot.lotId, database);
    }
    database.release();
    return lot;
}
export async function getLotByLotName(lotName) {
    return await _getLot(baseSQL + ' and l.lotName = ?', lotName);
}
export async function getLot(lotId) {
    return await _getLot(baseSQL + ' and l.lotId = ?', lotId);
}
export default getLot;
