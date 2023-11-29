import type { PoolConnection } from 'better-sqlite-pool';
interface LotFieldForm {
    lotId: string | number;
    lotTypeFieldId: string | number;
    lotFieldValue: string;
}
export declare function addOrUpdateLotField(lotFieldForm: LotFieldForm, user: User, connectedDatabase?: PoolConnection): Promise<boolean>;
export default addOrUpdateLotField;
