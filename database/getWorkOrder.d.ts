import type { PoolConnection } from 'better-sqlite-pool';
import type { WorkOrder } from '../types/recordTypes.js';
interface WorkOrderOptions {
    includeLotsAndLotOccupancies: boolean;
    includeComments: boolean;
    includeMilestones: boolean;
}
export declare function getWorkOrderByWorkOrderNumber(workOrderNumber: string): Promise<WorkOrder | undefined>;
export declare function getWorkOrder(workOrderId: number | string, options: WorkOrderOptions, connectedDatabase?: PoolConnection): Promise<WorkOrder | undefined>;
export default getWorkOrder;
