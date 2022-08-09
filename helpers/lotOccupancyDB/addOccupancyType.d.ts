import type * as recordTypes from "../../types/recordTypes";
interface AddOccupancyTypeForm {
    occupancyType: string;
    orderNumber?: number;
}
export declare const addOccupancyType: (occupancyTypeForm: AddOccupancyTypeForm, requestSession: recordTypes.PartialSession) => number;
export default addOccupancyType;
