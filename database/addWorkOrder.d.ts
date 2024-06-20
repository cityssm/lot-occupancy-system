export interface AddWorkOrderForm {
    workOrderTypeId: number | string;
    workOrderNumber?: string;
    workOrderDescription: string;
    workOrderOpenDateString?: string;
    workOrderCloseDateString?: string;
    lotOccupancyId?: string;
}
export default function addWorkOrder(workOrderForm: AddWorkOrderForm, user: User): Promise<number>;
