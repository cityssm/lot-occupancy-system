import type * as recordTypes from "../../types/recordTypes";
export declare const getWorkOrderByWorkOrderNumber: (workOrderNumber: string) => recordTypes.WorkOrder;
export declare const getWorkOrder: (workOrderId: number | string) => recordTypes.WorkOrder;
export default getWorkOrder;
