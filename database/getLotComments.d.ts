import type { PoolConnection } from 'better-sqlite-pool';
import type { LotComment } from '../types/recordTypes.js';
export declare function getLotComments(lotId: number | string, connectedDatabase?: PoolConnection): Promise<LotComment[]>;
export default getLotComments;
