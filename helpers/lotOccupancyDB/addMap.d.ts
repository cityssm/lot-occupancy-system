import type * as recordTypes from "../../types/recordTypes";
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
export declare const addMap: (mapForm: AddMapForm, requestSession: recordTypes.PartialSession) => number;
export default addMap;