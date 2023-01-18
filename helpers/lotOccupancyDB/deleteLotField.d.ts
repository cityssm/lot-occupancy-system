import type { PoolConnection } from 'better-sqlite-pool';
import type * as recordTypes from '../../types/recordTypes';
export declare function deleteLotField(lotId: number | string, lotTypeFieldId: number | string, requestSession: recordTypes.PartialSession, connectedDatabase?: PoolConnection): Promise<boolean>;
export default deleteLotField;
