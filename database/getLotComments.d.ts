import type { PoolConnection } from 'better-sqlite-pool';
import type * as recordTypes from '../types/recordTypes.js';
export declare function getLotComments(lotId: number | string, connectedDatabase?: PoolConnection): Promise<recordTypes.LotComment[]>;
export default getLotComments;
