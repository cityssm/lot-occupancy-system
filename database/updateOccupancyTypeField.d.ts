interface UpdateOccupancyTypeFieldForm {
    occupancyTypeFieldId: number | string;
    occupancyTypeField: string;
    isRequired: '0' | '1';
    minimumLength?: string;
    maximumLength?: string;
    pattern?: string;
    occupancyTypeFieldValues: string;
}
export declare function updateOccupancyTypeField(occupancyTypeFieldForm: UpdateOccupancyTypeFieldForm, user: User): Promise<boolean>;
export default updateOccupancyTypeField;
