import type * as recordTypes from "../../types/recordTypes";
interface AddWorkOrderTypeForm {
    workOrderType: string;
    orderNumber?: number;
}
export declare const addWorkOrderType: (workOrderTypeForm: AddWorkOrderTypeForm, requestSession: recordTypes.PartialSession) => number;
export default addWorkOrderType;