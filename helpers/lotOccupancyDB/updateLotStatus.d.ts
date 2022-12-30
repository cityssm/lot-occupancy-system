import type * as recordTypes from "../../types/recordTypes";
interface UpdateLotStatusForm {
    lotStatusId: number | string;
    lotStatus: string;
}
export declare function updateLotStatus(lotStatusForm: UpdateLotStatusForm, requestSession: recordTypes.PartialSession): boolean;
export default updateLotStatus;
