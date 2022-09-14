import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
interface WorkOrderMilestoneFilters {
    workOrderId?: number | string;
    workOrderMilestoneDateFilter?: "upcomingMissed" | "recent" | "date";
    workOrderMilestoneDateString?: string;
}
interface WorkOrderMilestoneOptions {
    includeWorkOrders?: boolean;
    orderBy: "completion" | "date";
}
export declare const getWorkOrderMilestones: (filters: WorkOrderMilestoneFilters, options: WorkOrderMilestoneOptions, connectedDatabase?: sqlite.Database) => recordTypes.WorkOrderMilestone[];
export default getWorkOrderMilestones;
