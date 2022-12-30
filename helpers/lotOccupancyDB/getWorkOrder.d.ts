import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
interface WorkOrderOptions {
    includeLotsAndLotOccupancies: boolean;
    includeComments: boolean;
    includeMilestones: boolean;
}
export declare function getWorkOrderByWorkOrderNumber(workOrderNumber: string): recordTypes.WorkOrder;
export declare function getWorkOrder(workOrderId: number | string, options: WorkOrderOptions, connectedDatabase?: sqlite.Database): recordTypes.WorkOrder;
export default getWorkOrder;
