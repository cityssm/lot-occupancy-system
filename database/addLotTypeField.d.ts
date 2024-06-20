export interface AddLotTypeFieldForm {
    lotTypeId: string | number;
    lotTypeField: string;
    lotTypeFieldValues?: string;
    isRequired?: string;
    pattern?: string;
    minimumLength: string | number;
    maximumLength: string | number;
    orderNumber?: number;
}
export default function addLotTypeField(lotTypeFieldForm: AddLotTypeFieldForm, user: User): Promise<number>;
