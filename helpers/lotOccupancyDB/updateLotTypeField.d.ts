import type * as recordTypes from "../../types/recordTypes";
interface UpdateLotTypeFieldForm {
    lotTypeFieldId: number | string;
    lotTypeField: string;
    isRequired: "0" | "1";
    minimumLength?: string;
    maximumLength?: string;
    pattern?: string;
    lotTypeFieldValues: string;
}
export declare const updateLotTypeField: (lotTypeFieldForm: UpdateLotTypeFieldForm, requestSession: recordTypes.PartialSession) => boolean;
export default updateLotTypeField;
