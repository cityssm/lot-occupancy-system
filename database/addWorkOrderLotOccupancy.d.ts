import type { PoolConnection } from 'better-sqlite-pool';
interface AddWorkOrderLotOccupancyForm {
    workOrderId: number | string;
    lotOccupancyId: number | string;
}
export declare function addWorkOrderLotOccupancy(workOrderLotOccupancyForm: AddWorkOrderLotOccupancyForm, user: User, connectedDatabase?: PoolConnection): Promise<boolean>;
export default addWorkOrderLotOccupancy;
