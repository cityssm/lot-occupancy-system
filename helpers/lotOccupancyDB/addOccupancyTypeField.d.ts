interface AddOccupancyTypeFieldForm {
    occupancyTypeId?: string | number;
    occupancyTypeField: string;
    occupancyTypeFieldValues?: string;
    isRequired?: string;
    pattern?: string;
    minimumLength: string | number;
    maximumLength: string | number;
    orderNumber?: number;
}
export declare function addOccupancyTypeField(occupancyTypeFieldForm: AddOccupancyTypeFieldForm, user: User): Promise<number>;
export default addOccupancyTypeField;
