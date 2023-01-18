import type { PoolConnection } from 'better-sqlite-pool';
import type * as recordTypes from '../../types/recordTypes';
interface LotFieldForm {
    lotId: string | number;
    lotTypeFieldId: string | number;
    lotFieldValue: string;
}
export declare function addOrUpdateLotField(lotFieldForm: LotFieldForm, requestSession: recordTypes.PartialSession, connectedDatabase?: PoolConnection): Promise<boolean>;
export default addOrUpdateLotField;
