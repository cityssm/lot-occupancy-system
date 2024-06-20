import type { PoolConnection } from 'better-sqlite-pool';
export default function deleteLotOccupancyField(lotOccupancyId: number | string, occupancyTypeFieldId: number | string, user: User, connectedDatabase?: PoolConnection): Promise<boolean>;
