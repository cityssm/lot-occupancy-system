import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
interface AddWorkOrderLotOccupancyForm {
    workOrderId: number | string;
    lotOccupancyId: number | string;
}
export declare function addWorkOrderLotOccupancy(workOrderLotOccupancyForm: AddWorkOrderLotOccupancyForm, requestSession: recordTypes.PartialSession, connectedDatabase?: sqlite.Database): boolean;
export default addWorkOrderLotOccupancy;
