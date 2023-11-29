interface AddWorkOrderForm {
    workOrderTypeId: number | string;
    workOrderNumber?: string;
    workOrderDescription: string;
    workOrderOpenDateString?: string;
    workOrderCloseDateString?: string;
    lotOccupancyId?: string;
}
export declare function addWorkOrder(workOrderForm: AddWorkOrderForm, user: User): Promise<number>;
export default addWorkOrder;
