export interface UpdateLotOccupancyFeeQuantityForm {
    lotOccupancyId: string | number;
    feeId: string | number;
    quantity: string | number;
}
export default function updateLotOccupancyFeeQuantity(feeQuantityForm: UpdateLotOccupancyFeeQuantityForm, user: User): Promise<boolean>;
