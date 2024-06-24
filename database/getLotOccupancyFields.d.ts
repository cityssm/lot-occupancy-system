import type { PoolConnection } from 'better-sqlite-pool';
import type { LotOccupancyField } from '../types/recordTypes.js';
export default function getLotOccupancyFields(lotOccupancyId: number | string, connectedDatabase?: PoolConnection): Promise<LotOccupancyField[]>;
