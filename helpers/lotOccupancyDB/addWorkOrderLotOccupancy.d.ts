import type { PoolConnection } from 'better-sqlite-pool';
import type * as recordTypes from '../../types/recordTypes';
interface AddWorkOrderLotOccupancyForm {
    workOrderId: number | string;
    lotOccupancyId: number | string;
}
export declare function addWorkOrderLotOccupancy(workOrderLotOccupancyForm: AddWorkOrderLotOccupancyForm, requestSession: recordTypes.PartialSession, connectedDatabase?: PoolConnection): Promise<boolean>;
export default addWorkOrderLotOccupancy;
