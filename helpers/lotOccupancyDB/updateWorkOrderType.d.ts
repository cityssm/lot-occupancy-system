import type * as recordTypes from "../../types/recordTypes";
interface UpdateWorkOrderTypeForm {
    workOrderTypeId: number | string;
    workOrderType: string;
}
export declare const updateWorkOrderType: (workOrderTypeForm: UpdateWorkOrderTypeForm, requestSession: recordTypes.PartialSession) => boolean;
export default updateWorkOrderType;
