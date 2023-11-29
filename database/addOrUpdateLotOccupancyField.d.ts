import type { PoolConnection } from 'better-sqlite-pool';
interface LotOccupancyFieldForm {
    lotOccupancyId: string | number;
    occupancyTypeFieldId: string | number;
    lotOccupancyFieldValue: string;
}
export declare function addOrUpdateLotOccupancyField(lotOccupancyFieldForm: LotOccupancyFieldForm, user: User, connectedDatabase?: PoolConnection): Promise<boolean>;
export default addOrUpdateLotOccupancyField;
