import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
interface AddOccupantForm {
    occupantName: string;
    occupantAddress1: string;
    occupantAddress2: string;
    occupantCity: string;
    occupantProvince: string;
    occupantPostalCode: string;
    occupantPhoneNumber: string;
}
export declare const addOccupant: (occupantForm: AddOccupantForm, requestSession: recordTypes.PartialSession, connectedDatabase?: sqlite.Database) => number;
export default addOccupant;
