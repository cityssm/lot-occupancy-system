import type { PoolConnection } from 'better-sqlite-pool';
export interface AddWorkOrderLotOccupancyForm {
    workOrderId: number | string;
    lotOccupancyId: number | string;
}
export default function addWorkOrderLotOccupancy(workOrderLotOccupancyForm: AddWorkOrderLotOccupancyForm, user: User, connectedDatabase?: PoolConnection): Promise<boolean>;
