import type { PoolConnection } from 'better-sqlite-pool';
import type * as recordTypes from '../types/recordTypes.js';
interface GetWorkOrdersFilters {
    workOrderTypeId?: number | string;
    workOrderOpenStatus?: '' | 'open' | 'closed';
    workOrderOpenDateString?: string;
    occupantName?: string;
    lotName?: string;
    lotOccupancyId?: number | string;
}
interface GetWorkOrdersOptions {
    limit: number;
    offset: number;
    includeLotsAndLotOccupancies?: boolean;
    includeComments?: boolean;
    includeMilestones?: boolean;
}
export declare function getWorkOrders(filters: GetWorkOrdersFilters, options: GetWorkOrdersOptions, connectedDatabase?: PoolConnection): Promise<{
    count: number;
    workOrders: recordTypes.WorkOrder[];
}>;
export default getWorkOrders;
