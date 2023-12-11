import * as configFunctions from '../helpers/functions.config.js';
import { acquireConnection } from './pool.js';
export async function getNextLotId(lotId) {
    const database = await acquireConnection();
    database.function('userFn_lotNameSortName', configFunctions.getProperty('settings.lot.lotNameSortNameFunction'));
    const result = database
        .prepare(`select lotId
        from Lots
        where recordDelete_timeMillis is null
        and userFn_lotNameSortName(lotName) > (select userFn_lotNameSortName(lotName) from Lots where lotId = ?)
        order by userFn_lotNameSortName(lotName)
        limit 1`)
        .get(lotId);
    database.release();
    if (result === undefined) {
        return undefined;
    }
    return result.lotId;
}
export default getNextLotId;
