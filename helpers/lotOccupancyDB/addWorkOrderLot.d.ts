import type * as recordTypes from '../../types/recordTypes';
interface AddWorkOrderLotForm {
    workOrderId: number | string;
    lotId: number | string;
}
export declare function addWorkOrderLot(workOrderLotForm: AddWorkOrderLotForm, requestSession: recordTypes.PartialSession): Promise<boolean>;
export default addWorkOrderLot;
