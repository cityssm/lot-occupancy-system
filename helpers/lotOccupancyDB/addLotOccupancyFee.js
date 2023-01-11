import sqlite from 'better-sqlite3';
import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js';
import { calculateFeeAmount, calculateTaxAmount } from '../functions.fee.js';
import { getFee } from './getFee.js';
import { getLotOccupancy } from './getLotOccupancy.js';
export function addLotOccupancyFee(lotOccupancyFeeForm, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    let feeAmount;
    let taxAmount;
    if (lotOccupancyFeeForm.feeAmount) {
        feeAmount =
            typeof lotOccupancyFeeForm.feeAmount === 'string'
                ? Number.parseFloat(lotOccupancyFeeForm.feeAmount)
                : 0;
        taxAmount =
            typeof lotOccupancyFeeForm.taxAmount === 'string'
                ? Number.parseFloat(lotOccupancyFeeForm.taxAmount)
                : 0;
    }
    else {
        const lotOccupancy = getLotOccupancy(lotOccupancyFeeForm.lotOccupancyId);
        const fee = getFee(lotOccupancyFeeForm.feeId);
        feeAmount = calculateFeeAmount(fee, lotOccupancy);
        taxAmount = calculateTaxAmount(fee, feeAmount);
    }
    const record = database
        .prepare(`select feeAmount, taxAmount, recordDelete_timeMillis
                from LotOccupancyFees
                where lotOccupancyId = ?
                and feeId = ?`)
        .get(lotOccupancyFeeForm.lotOccupancyId, lotOccupancyFeeForm.feeId);
    if (record) {
        if (record.recordDelete_timeMillis) {
            database
                .prepare(`delete from LotOccupancyFees
                        where recordDelete_timeMillis is not null
                        and lotOccupancyId = ?
                        and feeId = ?`)
                .run(lotOccupancyFeeForm.lotOccupancyId, lotOccupancyFeeForm.feeId);
        }
        else if (record.feeAmount === feeAmount &&
            record.taxAmount === taxAmount) {
            database
                .prepare(`update LotOccupancyFees
                        set quantity = quantity + ?,
                        recordUpdate_userName = ?,
                        recordUpdate_timeMillis = ?
                        where lotOccupancyId = ?
                        and feeId = ?`)
                .run(lotOccupancyFeeForm.quantity, requestSession.user.userName, rightNowMillis, lotOccupancyFeeForm.lotOccupancyId, lotOccupancyFeeForm.feeId);
            database.close();
            return true;
        }
        else {
            const quantity = typeof lotOccupancyFeeForm.quantity === 'string'
                ? Number.parseFloat(lotOccupancyFeeForm.quantity)
                : lotOccupancyFeeForm.quantity;
            database
                .prepare(`update LotOccupancyFees
            set feeAmount = (feeAmount * quantity) + ?,
            taxAmount = (taxAmount * quantity) + ?,
            quantity = 1,
            recordUpdate_userName = ?,
            recordUpdate_timeMillis = ?
            where lotOccupancyId = ?
            and feeId = ?`)
                .run(feeAmount * quantity, taxAmount * quantity, requestSession.user.userName, rightNowMillis, lotOccupancyFeeForm.lotOccupancyId, lotOccupancyFeeForm.feeId);
            database.close();
            return true;
        }
    }
    const result = database
        .prepare(`insert into LotOccupancyFees (
                lotOccupancyId, feeId,
                quantity, feeAmount, taxAmount,
                recordCreate_userName, recordCreate_timeMillis,
                recordUpdate_userName, recordUpdate_timeMillis)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(lotOccupancyFeeForm.lotOccupancyId, lotOccupancyFeeForm.feeId, lotOccupancyFeeForm.quantity, feeAmount, taxAmount, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    database.close();
    return result.changes > 0;
}
export default addLotOccupancyFee;
