import type * as recordTypes from "../../types/recordTypes";
interface AddLotOccupancyFieldForm {
    lotOccupancyId: string | number;
    occupancyTypeFieldId: string | number;
    lotOccupancyFieldValue: string;
}
export declare const addLotOccupancyField: (lotOccupancyFieldForm: AddLotOccupancyFieldForm, requestSession: recordTypes.PartialSession) => boolean;
export default addLotOccupancyField;
