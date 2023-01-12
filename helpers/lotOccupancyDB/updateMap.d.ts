import type * as recordTypes from '../../types/recordTypes';
interface UpdateMapForm {
    mapId: string;
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
export declare function updateMap(mapForm: UpdateMapForm, requestSession: recordTypes.PartialSession): boolean;
export default updateMap;
