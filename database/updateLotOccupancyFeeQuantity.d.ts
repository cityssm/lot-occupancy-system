interface UpdateLotOccupancyFeeQuantityForm {
    lotOccupancyId: string | number;
    feeId: string | number;
    quantity: string | number;
}
export declare function updateLotOccupancyFeeQuantity(feeQuantityForm: UpdateLotOccupancyFeeQuantityForm, user: User): Promise<boolean>;
export default updateLotOccupancyFeeQuantity;
