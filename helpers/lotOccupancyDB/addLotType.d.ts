import type * as recordTypes from "../../types/recordTypes";
interface AddLotTypeForm {
    lotType: string;
    orderNumber?: number;
}
export declare const addLotType: (lotTypeForm: AddLotTypeForm, requestSession: recordTypes.PartialSession) => number;
export default addLotType;
