import type { PoolConnection } from 'better-sqlite-pool';
export default function getOccupancyTypePrints(occupancyTypeId: number, connectedDatabase?: PoolConnection): Promise<string[]>;
