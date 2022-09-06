import type * as recordTypes from "../../types/recordTypes";
interface AddOccupancyTypeFieldForm {
    occupancyTypeId: string | number;
    occupancyTypeField: string;
    occupancyTypeFieldValues?: string;
    isRequired?: string;
    pattern?: string;
    minimumLength: string | number;
    maximumLength: string | number;
    orderNumber?: number;
}
export declare const addOccupancyTypeField: (occupancyTypeFieldForm: AddOccupancyTypeFieldForm, requestSession: recordTypes.PartialSession) => number;
export default addOccupancyTypeField;
