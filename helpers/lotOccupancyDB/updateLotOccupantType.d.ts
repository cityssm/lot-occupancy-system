import type * as recordTypes from "../../types/recordTypes";
interface UpdateLotOccupantTypeForm {
    lotOccupantTypeId: number | string;
    lotOccupantType: string;
}
export declare const updateLotOccupantType: (lotOccupantTypeForm: UpdateLotOccupantTypeForm, requestSession: recordTypes.PartialSession) => boolean;
export default updateLotOccupantType;
