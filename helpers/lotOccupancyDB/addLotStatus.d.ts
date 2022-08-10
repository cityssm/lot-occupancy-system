import type * as recordTypes from "../../types/recordTypes";
interface AddLotStatusForm {
    lotStatus: string;
    orderNumber?: number;
}
export declare const addLotStatus: (lotStatusForm: AddLotStatusForm, requestSession: recordTypes.PartialSession) => number;
export default addLotStatus;