import type * as recordTypes from "../../types/recordTypes";
interface AddLotOccupantTypeForm {
    lotOccupantType: string;
    fontAwesomeIconClass?: string;
    orderNumber?: number;
}
export declare function addLotOccupantType(lotOccupantTypeForm: AddLotOccupantTypeForm, requestSession: recordTypes.PartialSession): number;
export default addLotOccupantType;
