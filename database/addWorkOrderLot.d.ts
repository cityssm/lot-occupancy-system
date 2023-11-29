interface AddWorkOrderLotForm {
    workOrderId: number | string;
    lotId: number | string;
}
export declare function addWorkOrderLot(workOrderLotForm: AddWorkOrderLotForm, user: User): Promise<boolean>;
export default addWorkOrderLot;
