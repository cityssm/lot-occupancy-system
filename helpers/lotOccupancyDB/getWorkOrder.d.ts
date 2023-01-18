import type { PoolConnection } from 'better-sqlite-pool';
import type * as recordTypes from '../../types/recordTypes';
interface WorkOrderOptions {
    includeLotsAndLotOccupancies: boolean;
    includeComments: boolean;
    includeMilestones: boolean;
}
export declare function getWorkOrderByWorkOrderNumber(workOrderNumber: string): Promise<recordTypes.WorkOrder>;
export declare function getWorkOrder(workOrderId: number | string, options: WorkOrderOptions, connectedDatabase?: PoolConnection): Promise<recordTypes.WorkOrder>;
export default getWorkOrder;
