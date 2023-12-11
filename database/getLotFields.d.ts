import type { PoolConnection } from 'better-sqlite-pool';
import type { LotField } from '../types/recordTypes.js';
export declare function getLotFields(lotId: number | string, connectedDatabase?: PoolConnection): Promise<LotField[]>;
export default getLotFields;
