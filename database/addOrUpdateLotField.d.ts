import type { PoolConnection } from 'better-sqlite-pool';
export interface LotFieldForm {
    lotId: string | number;
    lotTypeFieldId: string | number;
    lotFieldValue: string;
}
export default function addOrUpdateLotField(lotFieldForm: LotFieldForm, user: User, connectedDatabase?: PoolConnection): Promise<boolean>;
