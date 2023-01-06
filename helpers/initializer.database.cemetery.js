import { lotOccupancyDB as databasePath } from "../data/databasePaths.js";
import { initializeDatabase } from "./initializer.database.js";
import { addOccupancyTypeField } from "./lotOccupancyDB/addOccupancyTypeField.js";
import { addLotOccupantType } from "./lotOccupancyDB/addLotOccupantType.js";
import Debug from "debug";
import { addRecord } from "./lotOccupancyDB/addRecord.js";
const debug = Debug("lot-occupancy-system:initialize");
const session = {
    user: {
        userName: "init.cemetery",
        userProperties: {
            canUpdate: true,
            isAdmin: true,
            apiKey: ""
        }
    }
};
function initializeCemeteryDatabase() {
    debug("Checking for " + databasePath + "...");
    const databaseInitialized = initializeDatabase();
    if (!databaseInitialized) {
        debug("Database already created.\n" +
            "To initialize this database with cemetery types, delete the database file first, then rerun this script.");
        return;
    }
    debug("New database file created.  Proceeding with initialization.");
    addRecord("LotTypes", "Casket Grave", 1, session);
    addRecord("LotTypes", "Columbarium", 2, session);
    addRecord("LotTypes", "Mausoleum", 2, session);
    addRecord("LotTypes", "Niche Wall", 2, session);
    addRecord("LotTypes", "Urn Garden", 2, session);
    addRecord("LotTypes", "Crematorium", 2, session);
    addRecord("LotStatuses", "Available", 1, session);
    addRecord("LotStatuses", "Reserved", 2, session);
    addRecord("LotStatuses", "Taken", 3, session);
    addLotOccupantType({
        lotOccupantType: "Deceased",
        orderNumber: 1
    }, session);
    addLotOccupantType({
        lotOccupantType: "Funeral Director",
        orderNumber: 2
    }, session);
    addLotOccupantType({
        lotOccupantType: "Preneed Owner",
        orderNumber: 3
    }, session);
    addLotOccupantType({
        lotOccupantType: "Purchaser",
        orderNumber: 4
    }, session);
    addRecord("OccupancyTypes", "Preneed", 1, session);
    const intermentOccupancyTypeId = addRecord("OccupancyTypes", "Interment", 2, session);
    const cremationOccupancyTypeId = addRecord("OccupancyTypes", "Cremation", 3, session);
    const deathDateField = {
        occupancyTypeId: intermentOccupancyTypeId,
        occupancyTypeField: "Death Date",
        occupancyTypeFieldValues: "",
        pattern: "\\d{4}([\\/-]\\d{2}){2}",
        isRequired: "",
        minimumLength: 10,
        maximumLength: 10,
        orderNumber: 1
    };
    addOccupancyTypeField(deathDateField, session);
    addOccupancyTypeField(Object.assign(deathDateField, { occupancyTypeId: cremationOccupancyTypeId }), session);
    const deathAgeField = {
        occupancyTypeId: intermentOccupancyTypeId,
        occupancyTypeField: "Death Age",
        occupancyTypeFieldValues: "",
        pattern: "\\d+",
        isRequired: "",
        minimumLength: 1,
        maximumLength: 3,
        orderNumber: 2
    };
    addOccupancyTypeField(deathAgeField, session);
    addOccupancyTypeField(Object.assign(deathAgeField, { occupancyTypeId: cremationOccupancyTypeId }), session);
    const deathAgePeriod = {
        occupancyTypeId: intermentOccupancyTypeId,
        occupancyTypeField: "Death Age Period",
        occupancyTypeFieldValues: "Years\nMonths\nDays\nStillborn",
        pattern: "",
        isRequired: "",
        minimumLength: 1,
        maximumLength: 10,
        orderNumber: 3
    };
    addOccupancyTypeField(deathAgePeriod, session);
    addOccupancyTypeField(Object.assign(deathAgePeriod, { occupancyTypeId: cremationOccupancyTypeId }), session);
    const deathPlace = {
        occupancyTypeId: intermentOccupancyTypeId,
        occupancyTypeField: "Death Place",
        occupancyTypeFieldValues: "",
        pattern: "",
        isRequired: "",
        minimumLength: 1,
        maximumLength: 100,
        orderNumber: 4
    };
    addOccupancyTypeField(deathPlace, session);
    addOccupancyTypeField(Object.assign(deathPlace, { occupancyTypeId: cremationOccupancyTypeId }), session);
    const funeralHome = {
        occupancyTypeId: intermentOccupancyTypeId,
        occupancyTypeField: "Funeral Home",
        occupancyTypeFieldValues: "",
        pattern: "",
        isRequired: "",
        minimumLength: 1,
        maximumLength: 100,
        orderNumber: 10
    };
    addOccupancyTypeField(funeralHome, session);
    addOccupancyTypeField(Object.assign(funeralHome, { occupancyTypeId: cremationOccupancyTypeId }), session);
    const funeralDate = {
        occupancyTypeId: intermentOccupancyTypeId,
        occupancyTypeField: "Funeral Date",
        occupancyTypeFieldValues: "",
        pattern: "\\d{4}([\\/-]\\d{2}){2}",
        isRequired: "",
        minimumLength: 10,
        maximumLength: 10,
        orderNumber: 11
    };
    addOccupancyTypeField(funeralDate, session);
    addOccupancyTypeField(Object.assign(funeralDate, { occupancyTypeId: cremationOccupancyTypeId }), session);
    const containerType = {
        occupancyTypeId: intermentOccupancyTypeId,
        occupancyTypeField: "Container Type",
        occupancyTypeFieldValues: "",
        pattern: "",
        isRequired: "",
        minimumLength: 1,
        maximumLength: 100,
        orderNumber: 20
    };
    addOccupancyTypeField(containerType, session);
    addOccupancyTypeField(Object.assign(containerType, { occupancyTypeId: cremationOccupancyTypeId }), session);
    const committalType = {
        occupancyTypeId: intermentOccupancyTypeId,
        occupancyTypeField: "Committal Type",
        occupancyTypeFieldValues: "",
        pattern: "",
        isRequired: "",
        minimumLength: 1,
        maximumLength: 100,
        orderNumber: 21
    };
    addOccupancyTypeField(committalType, session);
    addOccupancyTypeField(Object.assign(committalType, { occupancyTypeId: cremationOccupancyTypeId }), session);
    addRecord("FeeCategories", "Interment Rights", 1, session);
    addRecord("FeeCategories", "Cremation Services", 2, session);
    addRecord("FeeCategories", "Burial Charges", 3, session);
    addRecord("FeeCategories", "Disinterment of Human Remains", 4, session);
    addRecord("FeeCategories", "Additional Services", 4, session);
}
initializeCemeteryDatabase();
