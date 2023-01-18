import type { PoolConnection } from 'better-sqlite-pool';
import type * as recordTypes from '../../types/recordTypes';
export declare function deleteLotOccupancyField(lotOccupancyId: number | string, occupancyTypeFieldId: number | string, requestSession: recordTypes.PartialSession, connectedDatabase?: PoolConnection): Promise<boolean>;
export default deleteLotOccupancyField;
