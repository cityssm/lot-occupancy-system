import { type PoolConnection } from 'better-sqlite-pool';
export interface AddLotOccupancyFeeForm {
    lotOccupancyId: number | string;
    feeId: number | string;
    quantity: number | string;
    feeAmount?: number | string;
    taxAmount?: number | string;
}
export default function addLotOccupancyFee(lotOccupancyFeeForm: AddLotOccupancyFeeForm, user: User, connectedDatabase?: PoolConnection): Promise<boolean>;
