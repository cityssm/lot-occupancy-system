import type { PoolConnection } from 'better-sqlite-pool';
import type { LotOccupancy } from '../types/recordTypes.js';
export default function getLotOccupancy(lotOccupancyId: number | string, connectedDatabase?: PoolConnection): Promise<LotOccupancy | undefined>;
