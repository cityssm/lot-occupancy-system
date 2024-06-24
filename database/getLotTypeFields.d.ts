import type { PoolConnection } from 'better-sqlite-pool';
import type { LotTypeField } from '../types/recordTypes.js';
export default function getLotTypeFields(lotTypeId: number, connectedDatabase?: PoolConnection): Promise<LotTypeField[]>;
