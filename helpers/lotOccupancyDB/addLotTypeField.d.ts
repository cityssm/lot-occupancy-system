import type * as recordTypes from '../../types/recordTypes';
interface AddLotTypeFieldForm {
    lotTypeId: string | number;
    lotTypeField: string;
    lotTypeFieldValues?: string;
    isRequired?: string;
    pattern?: string;
    minimumLength: string | number;
    maximumLength: string | number;
    orderNumber?: number;
}
export declare function addLotTypeField(lotTypeFieldForm: AddLotTypeFieldForm, requestSession: recordTypes.PartialSession): Promise<number>;
export default addLotTypeField;
