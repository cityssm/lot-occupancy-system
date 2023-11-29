interface AddWorkOrderForm {
    workOrderId: number | string;
    workOrderCloseDateString?: string;
}
export declare function closeWorkOrder(workOrderForm: AddWorkOrderForm, user: User): Promise<boolean>;
export default closeWorkOrder;
