import type { PoolConnection } from 'better-sqlite-pool';
export declare function getNextWorkOrderNumber(connectedDatabase?: PoolConnection): Promise<string>;
export default getNextWorkOrderNumber;
