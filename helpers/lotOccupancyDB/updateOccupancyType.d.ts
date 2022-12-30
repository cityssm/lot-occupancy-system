import type * as recordTypes from "../../types/recordTypes";
interface UpdateOccupancyTypeForm {
    occupancyTypeId: number | string;
    occupancyType: string;
}
export declare function updateOccupancyType(occupancyTypeForm: UpdateOccupancyTypeForm, requestSession: recordTypes.PartialSession): boolean;
export default updateOccupancyType;
