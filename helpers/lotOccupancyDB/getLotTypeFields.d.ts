import type { PoolConnection } from 'better-sqlite-pool';
import type * as recordTypes from '../../types/recordTypes';
export declare function getLotTypeFields(lotTypeId: number, connectedDatabase?: PoolConnection): Promise<recordTypes.LotTypeField[]>;
export default getLotTypeFields;
