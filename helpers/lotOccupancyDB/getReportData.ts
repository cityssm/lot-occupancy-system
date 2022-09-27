/* eslint-disable no-case-declarations */

import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import * as configFunctions from "../functions.config.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import camelCase from "camelcase";

export interface ReportParameters {
    [parameterName: string]: string | number;
}

const mapCamelCase = camelCase(configFunctions.getProperty("aliases.map"));
const mapNameAlias = mapCamelCase + "Name";
const mapDescriptionAlias = mapCamelCase + "Description";
const mapAddress1Alias = mapCamelCase + "Address1";
const mapAddress2Alias = mapCamelCase + "Address2";
const mapCityAlias = mapCamelCase + "City";
const mapProvinceAlias = mapCamelCase + "Province";
const mapPostalCodeAlias = mapCamelCase + "PostalCode";
const mapPhoneNumberAlias = mapCamelCase + "PhoneNumber";

export const getReportData = (
    reportName: string,
    reportParameters?: ReportParameters
): unknown[] => {
    let sql: string;
    const sqlParameters = [];

    switch (reportName) {
        case "maps-all":
            sql = "select * from Maps";
            break;

        case "maps-formatted":
            sql =
                "select mapName as " +
                mapNameAlias +
                "," +
                " mapDescription as " +
                mapDescriptionAlias +
                "," +
                " mapAddress1 as " +
                mapAddress1Alias +
                "," +
                " mapAddress2 as " +
                mapAddress2Alias +
                "," +
                " mapCity as " +
                mapCityAlias +
                "," +
                " mapProvince as " +
                mapProvinceAlias +
                "," +
                " mapPostalCode as " +
                mapPostalCodeAlias +
                "," +
                " mapPhoneNumber as " +
                mapPhoneNumberAlias +
                " from Maps" +
                " where recordDelete_timeMillis is null" +
                " order by mapName";

            break;

        case "lots-all":
            sql = "select * from Lots";
            break;

        case "lots-byLotTypeId":
            sql =
                "select l.lotId," +
                " m.mapName, l.lotName," +
                " t.lotType, s.lotStatus" +
                " from Lots l" +
                " left join LotTypes t on l.lotTypeId = t.lotTypeId" +
                " left join LotStatuses s on l.lotStatusId = s.lotStatusId" +
                " left join Maps m on l.mapId = m.mapId" +
                " where l.recordDelete_timeMillis is null" +
                " and l.lotTypeId = ?";

            sqlParameters.push(reportParameters.lotTypeId);

            break;

        case "lots-byLotStatusId":
            sql =
                "select l.lotId," +
                " m.mapName, l.lotName," +
                " t.lotType, s.lotStatus" +
                " from Lots l" +
                " left join LotTypes t on l.lotTypeId = t.lotTypeId" +
                " left join LotStatuses s on l.lotStatusId = s.lotStatusId" +
                " left join Maps m on l.mapId = m.mapId" +
                " where l.recordDelete_timeMillis is null" +
                " and l.lotStatusId = ?";

            sqlParameters.push(reportParameters.lotStatusId);

            break;

        case "lots-byMapId":
            sql =
                "select l.lotId," +
                " m.mapName, l.lotName," +
                " t.lotType, s.lotStatus" +
                " from Lots l" +
                " left join LotTypes t on l.lotTypeId = t.lotTypeId" +
                " left join LotStatuses s on l.lotStatusId = s.lotStatusId" +
                " left join Maps m on l.mapId = m.mapId" +
                " where l.recordDelete_timeMillis is null" +
                " and l.mapId = ?";

            sqlParameters.push(reportParameters.mapId);

            break;

        case "lotComments-all":
            sql = "select * from LotComments";
            break;

        case "lotFields-all":
            sql = "select * from LotFields";
            break;

        case "lotOccupancies-all":
            sql = "select * from LotOccupancies";
            break;

        case "lotOccupancyComments-all":
            sql = "select * from LotOccupancyComments";
            break;

        case "lotOccupancyFees-all":
            sql = "select * from LotOccupancyFees";
            break;

        case "lotOccupancyFields-all":
            sql = "select * from LotOccupancyFields";
            break;

        case "lotOccupancyOccupants-all":
            sql = "select * from LotOccupancyOccupants";
            break;

        case "lotOccupancyTransactions-all":
            sql = "select * from LotOccupancyTransactions";
            break;

        case "workOrders-all":
            sql = "select * from WorkOrders";
            break;

        case "workOrders-open":
            sql =
                "select w.workOrderId, w.workOrderNumber," +
                " t.workOrderType, w.workOrderDescription," +
                " m.workOrderMilestoneCount, m.workOrderMilestoneCompletionCount" +
                " from WorkOrders w" +
                " left join WorkOrderTypes t on w.workOrderTypeId = t.workOrderTypeId" +
                (" left join (" +
                    "select m.workOrderId," +
                    " count(m.workOrderMilestoneId) as workOrderMilestoneCount," +
                    " sum(case when m.workOrderMilestoneCompletionDate is null then 0 else 1 end) as workOrderMilestoneCompletionCount" +
                    " from WorkOrderMilestones m" +
                    " where m.recordDelete_timeMillis is null" +
                    " group by m.workOrderId" +
                    ") m on w.workOrderId = m.workOrderId") +
                " where w.recordDelete_timeMillis is null" +
                " and w.workOrderCloseDate is null";
            break;

        case "workOrderComments-all":
            sql = "select * from WorkOrderComments";
            break;

        case "workOrderLots-all":
            sql = "select * from WorkOrderLots";
            break;

        case "workOrderMilestones-all":
            sql = "select * from WorkOrderMilestones";
            break;

        case "fees-all":
            sql = "select * from Fees";
            break;

        case "feeCategories-all":
            sql = "select * from FeeCategories";
            break;

        case "lotTypes-all":
            sql = "select * from LotTypes";
            break;

        case "lotTypeFields-all":
            sql = "select * from LotTypeFields";
            break;

        case "lotStatuses-all":
            sql = "select * from LotStatuses";
            break;

        case "occupancyTypes-all":
            sql = "select * from OccupancyTypes";
            break;

        case "occupancyTypeFields-all":
            sql = "select * from OccupancyTypeFields";
            break;

        case "lotOccupantTypes-all":
            sql = "select * from LotOccupantTypes";
            break;

        case "workOrderTypes-all":
            sql = "select * from WorkOrderTypes";
            break;

        case "workOrderMilestoneTypes-all":
            sql = "select * from WorkOrderMilestoneTypes";
            break;

        default:
            return undefined;
    }

    const database = sqlite(databasePath, {
        readonly: true
    });

    database.function("userFn_dateIntegerToString", dateTimeFunctions.dateIntegerToString);
    database.function("userFn_timeIntegerToString", dateTimeFunctions.timeIntegerToString);

    const rows = database.prepare(sql).all(sqlParameters);

    database.close();

    return rows;
};

export default getReportData;
