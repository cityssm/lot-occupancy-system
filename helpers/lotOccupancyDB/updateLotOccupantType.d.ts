import type * as recordTypes from "../../types/recordTypes";
interface UpdateLotOccupantTypeForm {
    lotOccupantTypeId: number | string;
    lotOccupantType: string;
    fontAwesomeIconClass?: string;
}
export declare function updateLotOccupantType(lotOccupantTypeForm: UpdateLotOccupantTypeForm, requestSession: recordTypes.PartialSession): boolean;
export default updateLotOccupantType;
