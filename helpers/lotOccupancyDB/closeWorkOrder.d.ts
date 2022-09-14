import type * as recordTypes from "../../types/recordTypes";
interface AddWorkOrderForm {
    workOrderId: number | string;
    workOrderCloseDateString?: string;
}
export declare const closeWorkOrder: (workOrderForm: AddWorkOrderForm, requestSession: recordTypes.PartialSession) => boolean;
export default closeWorkOrder;
