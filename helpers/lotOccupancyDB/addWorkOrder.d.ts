import type * as recordTypes from "../../types/recordTypes";
interface AddWorkOrderForm {
    workOrderTypeId: number | string;
    workOrderNumber?: string;
    workOrderDescription: string;
    workOrderOpenDateString?: string;
    workOrderCloseDateString?: string;
    lotOccupancyId?: string;
}
export declare function addWorkOrder(workOrderForm: AddWorkOrderForm, requestSession: recordTypes.PartialSession): number;
export default addWorkOrder;
