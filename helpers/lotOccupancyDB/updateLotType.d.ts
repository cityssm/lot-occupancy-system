import type * as recordTypes from "../../types/recordTypes";
interface UpdateLotTypeForm {
    lotTypeId: number | string;
    lotType: string;
}
export declare function updateLotType(lotTypeForm: UpdateLotTypeForm, requestSession: recordTypes.PartialSession): boolean;
export default updateLotType;
