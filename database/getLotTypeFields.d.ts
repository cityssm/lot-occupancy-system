import type { PoolConnection } from 'better-sqlite-pool';
import type { LotTypeField } from '../types/recordTypes.js';
export declare function getLotTypeFields(lotTypeId: number, connectedDatabase?: PoolConnection): Promise<LotTypeField[]>;
export default getLotTypeFields;
