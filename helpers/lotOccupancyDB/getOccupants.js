import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const getOccupants = (filters) => {
    const database = sqlite(databasePath, {
        readonly: true
    });
    let sqlWhereClause = "";
    const sqlParameters = [];
    if (filters.occupantName) {
        const occupantNamePieces = filters.occupantName.toLowerCase().split(" ");
        for (const occupantNamePiece of occupantNamePieces) {
            sqlWhereClause += " and instr(lower(occupantName), ?)";
            sqlParameters.push(occupantNamePiece);
        }
    }
    if (filters.occupantAddress) {
        const occupantAddressPieces = filters.occupantAddress.toLowerCase().split(" ");
        for (const occupantAddressPiece of occupantAddressPieces) {
            sqlWhereClause += " and (instr(lower(occupantAddress1), ?) or instr(lower(occupantAddress2), ?))";
            sqlParameters.push(occupantAddressPiece, occupantAddressPiece);
        }
    }
    if (filters.occupantCity) {
        const occupantCityPieces = filters.occupantCity.toLowerCase().split(" ");
        for (const occupantCityPiece of occupantCityPieces) {
            sqlWhereClause += " and instr(lower(occupantCity), ?)";
            sqlParameters.push(occupantCityPiece);
        }
    }
    if (filters.occupantPostalCode) {
        const occupantPostalCodePieces = filters.occupantPostalCode.toLowerCase().split(" ");
        for (const occupantPostalCodePiece of occupantPostalCodePieces) {
            sqlWhereClause += " and instr(lower(occupantPostalCode), ?)";
            sqlParameters.push(occupantPostalCodePiece);
        }
    }
    if (filters.occupantPhoneNumber) {
        const occupantPhoneNumberPieces = filters.occupantPhoneNumber.toLowerCase().split(" ");
        for (const occupantPhoneNumberPiece of occupantPhoneNumberPieces) {
            sqlWhereClause += " and instr(lower(occupantPhoneNumber), ?)";
            sqlParameters.push(occupantPhoneNumberPiece);
        }
    }
    const occupants = database
        .prepare("select occupantId, occupantName," +
        " occupantAddress1, occupantAddress2, occupantCity, occupantProvince, occupantPostalCode," +
        " occupantPhoneNumber" +
        " from Occupants" +
        " where recordDelete_timeMillis is null" +
        sqlWhereClause +
        " order by occupantName, occupantAddress1")
        .all(sqlParameters);
    database.close();
    return occupants;
};
export default getOccupants;
