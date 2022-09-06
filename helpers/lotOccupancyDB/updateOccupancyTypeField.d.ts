import type * as recordTypes from "../../types/recordTypes";
interface UpdateOccupancyTypeFieldForm {
    occupancyTypeFieldId: number | string;
    occupancyTypeField: string;
    isRequired: "0" | "1";
    minimumLength?: string;
    maximumLength?: string;
    pattern?: string;
    occupancyTypeFieldValues: string;
}
export declare const updateOccupancyTypeField: (occupancyTypeFieldForm: UpdateOccupancyTypeFieldForm, requestSession: recordTypes.PartialSession) => boolean;
export default updateOccupancyTypeField;
