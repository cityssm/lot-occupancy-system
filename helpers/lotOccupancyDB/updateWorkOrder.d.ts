interface UpdateWorkOrderForm {
    workOrderId: string;
    workOrderNumber: string;
    workOrderTypeId: string;
    workOrderDescription: string;
    workOrderOpenDateString: string;
}
export declare function updateWorkOrder(workOrderForm: UpdateWorkOrderForm, user: User): Promise<boolean>;
export default updateWorkOrder;
