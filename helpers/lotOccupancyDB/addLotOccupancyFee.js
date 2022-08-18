import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { calculateFeeAmount, calculateTaxAmount } from "../functions.fee.js";
import { getFee } from "./getFee.js";
import { getLotOccupancy } from "./getLotOccupancy.js";
export const addLotOccupancyFee = (lotOccupancyFeeForm, requestSession) => {
    const database = sqlite(databasePath);
    const record = database.prepare("select recordDelete_timeMillis" +
        " from LotOccupancyFees" +
        " where lotOccupancyId = ?" +
        " and feeId = ?")
        .get(lotOccupancyFeeForm.lotOccupancyId, lotOccupancyFeeForm.feeId);
    if (record) {
        if (record.recordDelete_timeMillis) {
            database.prepare("delete from LotOccupancyFees" +
                " where recordDelete_timeMillis is not null" +
                " and lotOccupancyId = ?" +
                " and feeId = ?")
                .run(lotOccupancyFeeForm.lotOccupancyId, lotOccupancyFeeForm.feeId);
        }
        else {
            database.close();
            return false;
        }
    }
    const lotOccupancy = getLotOccupancy(lotOccupancyFeeForm.lotOccupancyId);
    const fee = getFee(lotOccupancyFeeForm.feeId);
    const feeAmount = calculateFeeAmount(fee, lotOccupancy);
    const taxAmount = calculateTaxAmount(fee, feeAmount);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("insert into LotOccupancyFees (" +
        "lotOccupancyId, feeId," +
        " quantity, feeAmount, taxAmount," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .run(lotOccupancyFeeForm.lotOccupancyId, lotOccupancyFeeForm.feeId, lotOccupancyFeeForm.quantity, feeAmount, taxAmount, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    database.close();
    return result.changes > 0;
};
export default addLotOccupancyFee;
