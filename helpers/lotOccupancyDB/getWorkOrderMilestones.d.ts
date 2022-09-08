import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
export declare const getWorkOrderMilestones: (workOrderId: number | string, connectedDatabase?: sqlite.Database) => recordTypes.WorkOrderMilestone[];
export default getWorkOrderMilestones;
