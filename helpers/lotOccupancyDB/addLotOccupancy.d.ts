import type * as recordTypes from "../../types/recordTypes";
interface AddLotOccupancyForm {
    occupancyTypeId: string | number;
    lotId: string | number;
    occupancyStartDateString: string;
    occupancyEndDateString: string;
    occupancyTypeFieldIds: string;
    [lotOccupancyFieldValue_occupancyTypeFieldId: string]: unknown;
}
export declare const addLotOccupancy: (lotOccupancyForm: AddLotOccupancyForm, requestSession: recordTypes.PartialSession) => number;
export default addLotOccupancy;
