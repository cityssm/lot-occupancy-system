import { acquireConnection } from './pool.js';
import { dateIntegerToString, timeIntegerToString } from '@cityssm/utils-datetime';
import * as configFunctions from '../helpers/functions.config.js';
import * as gpFunctions from '../helpers/functions.dynamicsGP.js';
export async function getLotOccupancyTransactions(lotOccupancyId, options, connectedDatabase) {
    const database = connectedDatabase ?? (await acquireConnection());
    database.function('userFn_dateIntegerToString', dateIntegerToString);
    database.function('userFn_timeIntegerToString', timeIntegerToString);
    const lotOccupancyTransactions = database
        .prepare(`select lotOccupancyId, transactionIndex,
        transactionDate, userFn_dateIntegerToString(transactionDate) as transactionDateString,
        transactionTime, userFn_timeIntegerToString(transactionTime) as transactionTimeString,
        transactionAmount, externalReceiptNumber, transactionNote
        from LotOccupancyTransactions
        where recordDelete_timeMillis is null
        and lotOccupancyId = ?
        order by transactionDate, transactionTime, transactionIndex`)
        .all(lotOccupancyId);
    if (connectedDatabase === undefined) {
        database.release();
    }
    if ((options?.includeIntegrations ?? false) &&
        configFunctions.getProperty('settings.dynamicsGP.integrationIsEnabled')) {
        for (const transaction of lotOccupancyTransactions) {
            if ((transaction.externalReceiptNumber ?? '') !== '') {
                const gpDocument = await gpFunctions.getDynamicsGPDocument(transaction.externalReceiptNumber);
                if (gpDocument !== undefined) {
                    transaction.dynamicsGPDocument = gpDocument;
                }
            }
        }
    }
    return lotOccupancyTransactions;
}
export default getLotOccupancyTransactions;
