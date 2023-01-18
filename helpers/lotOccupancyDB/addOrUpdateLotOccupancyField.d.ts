import type { PoolConnection } from 'better-sqlite-pool';
import type * as recordTypes from '../../types/recordTypes';
interface LotOccupancyFieldForm {
    lotOccupancyId: string | number;
    occupancyTypeFieldId: string | number;
    lotOccupancyFieldValue: string;
}
export declare function addOrUpdateLotOccupancyField(lotOccupancyFieldForm: LotOccupancyFieldForm, requestSession: recordTypes.PartialSession, connectedDatabase?: PoolConnection): Promise<boolean>;
export default addOrUpdateLotOccupancyField;
