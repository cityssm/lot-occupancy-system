import type { PoolConnection } from 'better-sqlite-pool';
import type * as recordTypes from '../../types/recordTypes';
export declare function getLotFields(lotId: number | string, connectedDatabase?: PoolConnection): Promise<recordTypes.LotField[]>;
export default getLotFields;
