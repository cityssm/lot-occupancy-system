import type { PoolConnection } from 'better-sqlite-pool';
export default function deleteLotField(lotId: number | string, lotTypeFieldId: number | string, user: User, connectedDatabase?: PoolConnection): Promise<boolean>;
