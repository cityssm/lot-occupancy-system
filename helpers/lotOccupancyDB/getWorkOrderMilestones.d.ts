import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
interface WorkOrderMilestoneFilters {
    workOrderId?: number | string;
}
export declare const getWorkOrderMilestones: (filters: WorkOrderMilestoneFilters, connectedDatabase?: sqlite.Database) => recordTypes.WorkOrderMilestone[];
export default getWorkOrderMilestones;
