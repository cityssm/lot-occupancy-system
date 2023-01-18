import type * as recordTypes from '../../types/recordTypes';
export declare function deleteWorkOrderLot(workOrderId: number | string, lotId: number | string, requestSession: recordTypes.PartialSession): Promise<boolean>;
export default deleteWorkOrderLot;
