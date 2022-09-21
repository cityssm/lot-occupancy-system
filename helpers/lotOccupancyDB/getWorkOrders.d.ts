import type * as recordTypes from "../../types/recordTypes";
interface GetWorkOrdersFilters {
    workOrderTypeId?: number | string;
    workOrderOpenStatus?: "" | "open" | "closed";
    workOrderOpenDateString?: string;
}
interface GetWorkOrdersOptions {
    limit: number;
    offset: number;
}
export declare const getWorkOrders: (filters?: GetWorkOrdersFilters, options?: GetWorkOrdersOptions) => {
    count: number;
    workOrders: recordTypes.WorkOrder[];
};
export default getWorkOrders;
