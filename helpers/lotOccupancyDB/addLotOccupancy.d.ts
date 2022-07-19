import type * as recordTypes from "../../types/recordTypes";
interface AddLotOccupancyForm {
    occupancyTypeId: string | number;
    lotId: string | number;
    occupancyStartDateString: string;
    occupancyEndDateString: string;
}
export declare const addLotOccupancy: (lotOccupancyForm: AddLotOccupancyForm, requestSession: recordTypes.PartialSession) => number;
export default addLotOccupancy;
