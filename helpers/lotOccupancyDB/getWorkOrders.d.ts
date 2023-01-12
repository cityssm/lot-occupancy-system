import sqlite from 'better-sqlite3';
import type * as recordTypes from '../../types/recordTypes';
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
export declare function getWorkOrders(filters: GetWorkOrdersFilters, options?: GetWorkOrdersOptions, connectedDatabase?: sqlite.Database): {
    count: number;
    workOrders: recordTypes.WorkOrder[];
};
export default getWorkOrders;
