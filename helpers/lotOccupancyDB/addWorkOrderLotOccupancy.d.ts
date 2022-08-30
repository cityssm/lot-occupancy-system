import type * as recordTypes from "../../types/recordTypes";
interface AddWorkOrderLotOccupancyForm {
    workOrderId: number | string;
    lotOccupancyId: number | string;
}
export declare const addWorkOrderLotOccupancy: (workOrderLotOccupancyForm: AddWorkOrderLotOccupancyForm, requestSession: recordTypes.PartialSession) => boolean;
export default addWorkOrderLotOccupancy;
