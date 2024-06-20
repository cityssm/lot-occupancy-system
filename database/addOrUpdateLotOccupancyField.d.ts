import type { PoolConnection } from 'better-sqlite-pool';
export interface LotOccupancyFieldForm {
    lotOccupancyId: string | number;
    occupancyTypeFieldId: string | number;
    lotOccupancyFieldValue: string;
}
export default function addOrUpdateLotOccupancyField(lotOccupancyFieldForm: LotOccupancyFieldForm, user: User, connectedDatabase?: PoolConnection): Promise<boolean>;
