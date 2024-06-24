export interface UpdateLotTypeFieldForm {
    lotTypeFieldId: number | string;
    lotTypeField: string;
    isRequired: '0' | '1';
    minimumLength?: string;
    maximumLength?: string;
    pattern?: string;
    lotTypeFieldValues: string;
}
export default function updateLotTypeField(lotTypeFieldForm: UpdateLotTypeFieldForm, user: User): Promise<boolean>;
