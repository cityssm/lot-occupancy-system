import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
export declare function getWorkOrderComments(workOrderId: number | string, connectedDatabase?: sqlite.Database): recordTypes.WorkOrderComment[];
export default getWorkOrderComments;
