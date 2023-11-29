interface OccupancyTypePrintForm {
    occupancyTypeId: string | number;
    printEJS: string;
    orderNumber?: number;
}
export declare function addOccupancyTypePrint(occupancyTypePrintForm: OccupancyTypePrintForm, user: User): Promise<boolean>;
export default addOccupancyTypePrint;
