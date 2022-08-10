import type * as recordTypes from "../../types/recordTypes";
interface UpdateLotOccupancyForm {
    lotOccupancyId: string | number;
    occupancyTypeId: string | number;
    lotId: string | number;
    occupancyStartDateString: string;
    occupancyEndDateString: string;
    occupancyTypeFieldIds: string;
    [lotOccupancyFieldValue_occupancyTypeFieldId: string]: unknown;
}
export declare function updateLotOccupancy(lotOccupancyForm: UpdateLotOccupancyForm, requestSession: recordTypes.PartialSession): boolean;
export default updateLotOccupancy;
