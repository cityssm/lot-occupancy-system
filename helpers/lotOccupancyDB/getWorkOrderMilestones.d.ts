import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
export interface WorkOrderMilestoneFilters {
    workOrderId?: number | string;
    workOrderMilestoneDateFilter?: "upcomingMissed" | "recent" | "date";
    workOrderMilestoneDateString?: string;
    workOrderTypeIds?: string;
    workOrderMilestoneTypeIds?: string;
}
interface WorkOrderMilestoneOptions {
    includeWorkOrders?: boolean;
    orderBy: "completion" | "date";
}
export declare function getWorkOrderMilestones(filters: WorkOrderMilestoneFilters, options: WorkOrderMilestoneOptions, connectedDatabase?: sqlite.Database): recordTypes.WorkOrderMilestone[];
export default getWorkOrderMilestones;
