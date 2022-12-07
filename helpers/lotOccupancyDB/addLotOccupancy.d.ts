import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
interface AddLotOccupancyForm {
    occupancyTypeId: string | number;
    lotId: string | number;
    occupancyStartDateString: string;
    occupancyEndDateString: string;
    occupancyTypeFieldIds?: string;
    [lotOccupancyFieldValue_occupancyTypeFieldId: string]: unknown;
    lotOccupantTypeId: string;
    occupantName?: string;
    occupantAddress1?: string;
    occupantAddress2?: string;
    occupantCity?: string;
    occupantProvince?: string;
    occupantPostalCode?: string;
    occupantPhoneNumber?: string;
    occupantEmailAddress?: string;
    occupantComment?: string;
}
export declare const addLotOccupancy: (lotOccupancyForm: AddLotOccupancyForm, requestSession: recordTypes.PartialSession, connectedDatabase?: sqlite.Database) => number;
export default addLotOccupancy;
