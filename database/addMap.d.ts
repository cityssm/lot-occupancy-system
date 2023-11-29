interface AddMapForm {
    mapName: string;
    mapDescription: string;
    mapSVG: string;
    mapLatitude: string;
    mapLongitude: string;
    mapAddress1: string;
    mapAddress2: string;
    mapCity: string;
    mapProvince: string;
    mapPostalCode: string;
    mapPhoneNumber: string;
}
export declare function addMap(mapForm: AddMapForm, user: User): Promise<number>;
export default addMap;
