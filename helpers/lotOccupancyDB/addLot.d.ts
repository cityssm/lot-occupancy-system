import type * as recordTypes from "../../types/recordTypes";
interface AddLotForm {
    lotName: string;
    lotTypeId: string | number;
    lotTypeStatusId: string | number;
    mapId: string | number;
    mapKey: string;
    lotLatitude: string;
    lotLongitude: string;
}
export declare const addLot: (lotForm: AddLotForm, requestSession: recordTypes.PartialSession) => number;
export default addLot;
