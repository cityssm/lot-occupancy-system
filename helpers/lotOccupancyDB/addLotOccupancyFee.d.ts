import type * as recordTypes from "../../types/recordTypes";
interface AddLotOccupancyFeeForm {
    lotOccupancyId: string;
    feeId: string;
    quantity: number | string;
}
export declare const addLotOccupancyFee: (lotOccupancyFeeForm: AddLotOccupancyFeeForm, requestSession: recordTypes.PartialSession) => boolean;
export default addLotOccupancyFee;
