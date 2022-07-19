import type * as recordTypes from "../../types/recordTypes";
interface AddLotOccupancyOccupantForm {
    lotOccupancyId: string | number;
    occupantId: string | number;
    lotOccupantTypeId: string | number;
}
export declare const addLotOccupancyOccupant: (lotOccupancyOccupantForm: AddLotOccupancyOccupantForm, requestSession: recordTypes.PartialSession) => number;
export default addLotOccupancyOccupant;
