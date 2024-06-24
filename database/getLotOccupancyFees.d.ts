import type { PoolConnection } from 'better-sqlite-pool';
import type { LotOccupancyFee } from '../types/recordTypes.js';
export default function getLotOccupancyFees(lotOccupancyId: number | string, connectedDatabase?: PoolConnection): Promise<LotOccupancyFee[]>;
