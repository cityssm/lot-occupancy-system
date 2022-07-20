import type * as recordTypes from "../../types/recordTypes";
interface UpdateLotForm {
    lotId: string | number;
    lotName: string;
    lotTypeId: string | number;
    lotStatusId: string | number;
    mapId: string | number;
    mapKey: string;
    lotLatitude: string;
    lotLongitude: string;
}
export declare function updateLot(lotForm: UpdateLotForm, requestSession: recordTypes.PartialSession): boolean;
export declare function updateLotStatus(lotId: number | string, lotStatusId: number | string, requestSession: recordTypes.PartialSession): boolean;
export default updateLot;
