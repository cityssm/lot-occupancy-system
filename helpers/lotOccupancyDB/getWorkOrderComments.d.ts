import type { PoolConnection } from 'better-sqlite-pool';
import type * as recordTypes from '../../types/recordTypes';
export declare function getWorkOrderComments(workOrderId: number | string, connectedDatabase?: PoolConnection): Promise<recordTypes.WorkOrderComment[]>;
export default getWorkOrderComments;
