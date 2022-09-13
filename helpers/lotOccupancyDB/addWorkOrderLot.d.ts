import type * as recordTypes from "../../types/recordTypes";
interface AddWorkOrderLotForm {
    workOrderId: number | string;
    lotId: number | string;
}
export declare const addWorkOrderLot: (workOrderLotForm: AddWorkOrderLotForm, requestSession: recordTypes.PartialSession) => boolean;
export default addWorkOrderLot;