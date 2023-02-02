import type { PoolConnection } from 'better-sqlite-pool';
import type * as recordTypes from '../../types/recordTypes';
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
export declare function getWorkOrderMilestones(filters: WorkOrderMilestoneFilters, options: WorkOrderMilestoneOptions, connectedDatabase?: PoolConnection): Promise<recordTypes.WorkOrderMilestone[]>;
export default getWorkOrderMilestones;
