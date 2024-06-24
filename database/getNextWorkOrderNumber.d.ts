import type { PoolConnection } from 'better-sqlite-pool';
export default function getNextWorkOrderNumber(connectedDatabase?: PoolConnection): Promise<string>;
