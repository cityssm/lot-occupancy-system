import { type DateString } from '@cityssm/utils-datetime';
export interface UpdateWorkOrderForm {
    workOrderId: string;
    workOrderNumber: string;
    workOrderTypeId: string;
    workOrderDescription: string;
    workOrderOpenDateString: DateString;
}
export default function updateWorkOrder(workOrderForm: UpdateWorkOrderForm, user: User): Promise<boolean>;
