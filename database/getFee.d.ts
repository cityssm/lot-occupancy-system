import type { PoolConnection } from 'better-sqlite-pool';
import type { Fee } from '../types/recordTypes.js';
export declare function getFee(feeId: number | string, connectedDatabase?: PoolConnection): Promise<Fee | undefined>;
export default getFee;
