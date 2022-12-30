import type * as recordTypes from "../../types/recordTypes";
interface UpdateWorkOrderTypeForm {
    workOrderTypeId: number | string;
    workOrderType: string;
}
export declare function updateWorkOrderType(workOrderTypeForm: UpdateWorkOrderTypeForm, requestSession: recordTypes.PartialSession): boolean;
export default updateWorkOrderType;
