import type { PoolConnection } from 'better-sqlite-pool';
import type { LotComment } from '../types/recordTypes.js';
export default function getLotComments(lotId: number | string, connectedDatabase?: PoolConnection): Promise<LotComment[]>;
