import type * as recordTypes from "../../types/recordTypes";
interface AddLotOccupantTypeForm {
    lotOccupantType: string;
    orderNumber?: number;
}
export declare const addLotOccupantType: (lotOccupantTypeForm: AddLotOccupantTypeForm, requestSession: recordTypes.PartialSession) => number;
export default addLotOccupantType;
