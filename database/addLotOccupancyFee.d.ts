interface AddLotOccupancyFeeForm {
    lotOccupancyId: number | string;
    feeId: number | string;
    quantity: number | string;
    feeAmount?: number | string;
    taxAmount?: number | string;
}
export declare function addLotOccupancyFee(lotOccupancyFeeForm: AddLotOccupancyFeeForm, user: User): Promise<boolean>;
export default addLotOccupancyFee;
