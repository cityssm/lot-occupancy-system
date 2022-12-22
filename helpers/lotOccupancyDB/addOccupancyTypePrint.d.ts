import type * as recordTypes from "../../types/recordTypes";
interface OccupancyTypePrintForm {
    occupancyTypeId: string | number;
    printEJS: string;
    orderNumber?: number;
}
export declare const addOccupancyTypePrint: (occupancyTypePrintForm: OccupancyTypePrintForm, requestSession: recordTypes.PartialSession) => boolean;
export default addOccupancyTypePrint;
