import type { PoolConnection } from 'better-sqlite-pool';
export declare function getOccupancyTypePrints(occupancyTypeId: number, connectedDatabase?: PoolConnection): Promise<string[]>;
export default getOccupancyTypePrints;
