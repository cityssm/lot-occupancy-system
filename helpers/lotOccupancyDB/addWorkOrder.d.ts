import type * as recordTypes from "../../types/recordTypes";
interface AddWorkOrderForm {
    workOrderTypeId: number | string;
    workOrderNumber?: string;
    workOrderDescription: string;
    workOrderOpenDateString?: string;
    workOrderCloseDateString?: string;
    lotOccupancyId?: string;
}
export declare const addWorkOrder: (workOrderForm: AddWorkOrderForm, requestSession: recordTypes.PartialSession) => number;
export default addWorkOrder;
