import type { PoolConnection } from 'better-sqlite-pool';
import type { WorkOrderMilestone } from '../types/recordTypes.js';
export interface WorkOrderMilestoneFilters {
    workOrderId?: number | string;
    workOrderMilestoneDateFilter?: 'upcomingMissed' | 'recent' | 'date' | 'blank' | 'notBlank';
    workOrderMilestoneDateString?: string;
    workOrderTypeIds?: string;
    workOrderMilestoneTypeIds?: string;
}
interface WorkOrderMilestoneOptions {
    includeWorkOrders?: boolean;
    orderBy: 'completion' | 'date';
}
export default function getWorkOrderMilestones(filters: WorkOrderMilestoneFilters, options: WorkOrderMilestoneOptions, connectedDatabase?: PoolConnection): Promise<WorkOrderMilestone[]>;
export {};
