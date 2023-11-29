interface AddLotForm {
    lotName: string;
    lotTypeId: string | number;
    lotStatusId: string | number;
    mapId: string | number;
    mapKey: string;
    lotLatitude: string;
    lotLongitude: string;
    lotTypeFieldIds?: string;
    [lotFieldValue_lotTypeFieldId: string]: unknown;
}
export declare function addLot(lotForm: AddLotForm, user: User): Promise<number>;
export default addLot;
