import type { PoolConnection } from 'better-sqlite-pool';
import type { LotField } from '../types/recordTypes.js';
export default function getLotFields(lotId: number | string, connectedDatabase?: PoolConnection): Promise<LotField[]>;
