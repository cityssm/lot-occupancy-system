import type { PoolConnection } from 'better-sqlite-pool';
export declare function deleteLotField(lotId: number | string, lotTypeFieldId: number | string, user: User, connectedDatabase?: PoolConnection): Promise<boolean>;
export default deleteLotField;
