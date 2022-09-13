import type * as recordTypes from "../../types/recordTypes";
interface UpdateWorkOrderForm {
    workOrderId: string;
    workOrderNumber: string;
    workOrderTypeId: string;
    workOrderDescription: string;
    workOrderOpenDateString: string;
}
export declare const updateWorkOrder: (workOrderForm: UpdateWorkOrderForm, requestSession: recordTypes.PartialSession) => boolean;
export default updateWorkOrder;