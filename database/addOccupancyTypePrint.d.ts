export interface AddOccupancyTypePrintForm {
    occupancyTypeId: string | number;
    printEJS: string;
    orderNumber?: number;
}
export default function addOccupancyTypePrint(occupancyTypePrintForm: AddOccupancyTypePrintForm, user: User): Promise<boolean>;
