import type * as recordTypes from '../../types/recordTypes';
interface AddWorkOrderForm {
    workOrderId: number | string;
    workOrderCloseDateString?: string;
}
export declare function closeWorkOrder(workOrderForm: AddWorkOrderForm, requestSession: recordTypes.PartialSession): Promise<boolean>;
export default closeWorkOrder;
