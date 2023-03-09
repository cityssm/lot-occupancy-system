import type * as recordTypes from '../../types/recordTypes';
interface UpdateLotOccupancyFeeQuantityForm {
    lotOccupancyId: string | number;
    feeId: string | number;
    quantity: string | number;
}
export declare function updateLotOccupancyFeeQuantity(feeQuantityForm: UpdateLotOccupancyFeeQuantityForm, requestSession: recordTypes.PartialSession): Promise<boolean>;
export default updateLotOccupancyFeeQuantity;
