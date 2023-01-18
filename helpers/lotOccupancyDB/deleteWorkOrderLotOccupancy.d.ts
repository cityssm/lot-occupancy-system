import type * as recordTypes from '../../types/recordTypes';
export declare function deleteWorkOrderLotOccupancy(workOrderId: number | string, lotOccupancyId: number | string, requestSession: recordTypes.PartialSession): Promise<boolean>;
export default deleteWorkOrderLotOccupancy;
