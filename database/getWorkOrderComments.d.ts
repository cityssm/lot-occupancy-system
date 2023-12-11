import type { PoolConnection } from 'better-sqlite-pool';
import type { WorkOrderComment } from '../types/recordTypes.js';
export declare function getWorkOrderComments(workOrderId: number | string, connectedDatabase?: PoolConnection): Promise<WorkOrderComment[]>;
export default getWorkOrderComments;
