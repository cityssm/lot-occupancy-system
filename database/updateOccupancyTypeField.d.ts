export interface UpdateOccupancyTypeFieldForm {
    occupancyTypeFieldId: number | string;
    occupancyTypeField: string;
    isRequired: '0' | '1';
    fieldType?: string;
    minimumLength?: string;
    maximumLength?: string;
    pattern?: string;
    occupancyTypeFieldValues: string;
}
export default function updateOccupancyTypeField(occupancyTypeFieldForm: UpdateOccupancyTypeFieldForm, user: User): Promise<boolean>;
