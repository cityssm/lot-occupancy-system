import type * as recordTypes from '../../types/recordTypes';
interface AddLotOccupancyFeeForm {
    lotOccupancyId: number | string;
    feeId: number | string;
    quantity: number | string;
    feeAmount?: number | string;
    taxAmount?: number | string;
}
export declare function addLotOccupancyFee(lotOccupancyFeeForm: AddLotOccupancyFeeForm, requestSession: recordTypes.PartialSession): boolean;
export default addLotOccupancyFee;
