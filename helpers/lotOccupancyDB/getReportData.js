import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import * as configFunctions from "../functions.config.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
import camelCase from "camelcase";
const mapCamelCase = camelCase(configFunctions.getProperty("aliases.map"));
const mapNameAlias = mapCamelCase + "Name";
const mapDescriptionAlias = mapCamelCase + "Description";
const mapAddress1Alias = mapCamelCase + "Address1";
const mapAddress2Alias = mapCamelCase + "Address2";
const mapCityAlias = mapCamelCase + "City";
const mapProvinceAlias = mapCamelCase + "Province";
const mapPostalCodeAlias = mapCamelCase + "PostalCode";
const mapPhoneNumberAlias = mapCamelCase + "PhoneNumber";
export const getReportData = (reportName, reportParameters) => {
    let sql;
    const sqlParameters = [];
    switch (reportName) {
        case "maps-all":
            sql = "select * from Maps";
            break;
        case "maps-formatted":
            sql = "select mapName as " + mapNameAlias + "," +
                " mapDescription as " + mapDescriptionAlias + "," +
                " mapAddress1 as " + mapAddress1Alias + "," +
                " mapAddress2 as " + mapAddress2Alias + "," +
                " mapCity as " + mapCityAlias + "," +
                " mapProvince as " + mapProvinceAlias + "," +
                " mapPostalCode as " + mapPostalCodeAlias + "," +
                " mapPhoneNumber as " + mapPhoneNumberAlias +
                " from Maps" +
                " where recordDelete_timeMillis is null" +
                " order by mapName";
            break;
        case "lots-all":
            sql = "select * from Lots";
            break;
        default:
            return undefined;
    }
    const database = sqlite(databasePath, {
        readonly: true
    });
    database.function("userFn_dateIntegerToString", dateTimeFunctions.dateIntegerToString);
    database.function("userFn_timeIntegerToString", dateTimeFunctions.timeIntegerToString);
    const rows = database.prepare(sql)
        .all(sqlParameters);
    database.close();
    return rows;
};
export default getReportData;
