import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
interface AddLotOccupancyOccupantForm {
    lotOccupancyId: string | number;
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
export declare const addLotOccupancyOccupant: (lotOccupancyOccupantForm: AddLotOccupancyOccupantForm, requestSession: recordTypes.PartialSession, connectedDatabase?: sqlite.Database) => number;
export default addLotOccupancyOccupant;
