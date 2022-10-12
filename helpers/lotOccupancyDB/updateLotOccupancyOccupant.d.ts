import type * as recordTypes from "../../types/recordTypes";
interface UpdateLotOccupancyOccupantForm {
    lotOccupancyId: string | number;
    lotOccupantIndex: string | number;
    lotOccupantTypeId: string | number;
    occupantName: string;
    occupantAddress1: string;
    occupantAddress2: string;
    occupantCity: string;
    occupantProvince: string;
    occupantPostalCode: string;
    occupantPhoneNumber: string;
    occupantEmailAddress: string;
}
export declare const updateLotOccupancyOccupant: (lotOccupancyOccupantForm: UpdateLotOccupancyOccupantForm, requestSession: recordTypes.PartialSession) => boolean;
export default updateLotOccupancyOccupant;
