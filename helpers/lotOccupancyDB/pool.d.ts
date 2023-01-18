import { PoolConnection } from 'better-sqlite-pool';
export declare function acquireConnection(): Promise<PoolConnection>;
