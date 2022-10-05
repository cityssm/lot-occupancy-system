import { lotOccupancyDB as databasePath } from "../data/databasePaths.js";

import { initializeDatabase } from "./initializer.database.js";

import { addLotType } from "./lotOccupancyDB/addLotType.js";

import { addOccupancyType } from "./lotOccupancyDB/addOccupancyType.js";

import { addOccupancyTypeField } from "./lotOccupancyDB/addOccupancyTypeField.js";

import { addLotStatus } from "./lotOccupancyDB/addLotStatus.js";

import { addLotOccupantType } from "./lotOccupancyDB/addLotOccupantType.js";

import { addFeeCategory } from "./lotOccupancyDB/addFeeCategory.js";

import type { PartialSession } from "../types/recordTypes.js";

import Debug from "debug";
const debug = Debug("lot-occupancy-system:initialize");

const session: PartialSession = {
    user: {
        userName: "init.cemetery",
        userProperties: {
            canUpdate: true,
            isAdmin: true,
            apiKey: ""
        }
    }
};

const initializeCemeteryDatabase = () => {
    /*
     * Ensure database does not already exist
     */

    debug("Checking for " + databasePath + "...");

    const databaseInitialized = initializeDatabase();

    if (!databaseInitialized) {
        debug(
            "Database already created.\n" +
                "To initialize this database with cemetery types, delete the database file first, then rerun this script."
        );
        return;
    }

    debug("New database file created.  Proceeding with initialization.");

    /*
     * Lot Types
     */

    addLotType(
        {
            lotType: "Casket Grave",
            orderNumber: 1
        },
        session
    );

    addLotType(
        {
            lotType: "Columbarium",
            orderNumber: 2
        },
        session
    );

    addLotType(
        {
            lotType: "Mausoleum",
            orderNumber: 2
        },
        session
    );

    addLotType(
        {
            lotType: "Niche Wall",
            orderNumber: 2
        },
        session
    );

    addLotType(
        {
            lotType: "Urn Garden",
            orderNumber: 2
        },
        session
    );

    addLotType(
        {
            lotType: "Crematorium",
            orderNumber: 3
        },
        session
    );

    /*
     * Lot Statuses
     */

    addLotStatus(
        {
            lotStatus: "Available",
            orderNumber: 1
        },
        session
    );

    addLotStatus(
        {
            lotStatus: "Reserved",
            orderNumber: 2
        },
        session
    );

    addLotStatus(
        {
            lotStatus: "Taken",
            orderNumber: 3
        },
        session
    );

    /*
     * Lot Occupant Types
     */

    addLotOccupantType(
        {
            lotOccupantType: "Deceased",
            orderNumber: 1
        },
        session
    );

    addLotOccupantType(
        {
            lotOccupantType: "Preneed Owner",
            orderNumber: 2
        },
        session
    );

    addLotOccupantType(
        {
            lotOccupantType: "Purchaser",
            orderNumber: 3
        },
        session
    );

    /*
     * Occupancy Types
     */

    addOccupancyType(
        {
            occupancyType: "Preneed",
            orderNumber: 1
        },
        session
    );

    const intermentOccupancyTypeId = addOccupancyType(
        {
            occupancyType: "Interment",
            orderNumber: 2
        },
        session
    );

    addOccupancyType(
        {
            occupancyType: "Cremation",
            orderNumber: 3
        },
        session
    );

    addOccupancyTypeField(
        {
            occupancyTypeId: intermentOccupancyTypeId,
            occupancyTypeField: "Death Date",
            occupancyTypeFieldValues: "",
            pattern: "\\d{4}([\\/-]\\d{2}){2}",
            isRequired: "",
            minimumLength: 10,
            maximumLength: 10,
            orderNumber: 1
        },
        session
    );

    addOccupancyTypeField(
        {
            occupancyTypeId: intermentOccupancyTypeId,
            occupancyTypeField: "Death Age",
            occupancyTypeFieldValues: "",
            pattern: "\\d+",
            isRequired: "",
            minimumLength: 1,
            maximumLength: 3,
            orderNumber: 2
        },
        session
    );

    addOccupancyTypeField(
        {
            occupancyTypeId: intermentOccupancyTypeId,
            occupancyTypeField: "Death Age Period",
            occupancyTypeFieldValues: "Years,Months,Days,Stillborn",
            pattern: "",
            isRequired: "",
            minimumLength: 1,
            maximumLength: 10,
            orderNumber: 3
        },
        session
    );

    addOccupancyTypeField(
        {
            occupancyTypeId: intermentOccupancyTypeId,
            occupancyTypeField: "Funeral Home",
            occupancyTypeFieldValues: "",
            pattern: "",
            isRequired: "",
            minimumLength: 1,
            maximumLength: 100,
            orderNumber: 10
        },
        session
    );

    addOccupancyTypeField(
        {
            occupancyTypeId: intermentOccupancyTypeId,
            occupancyTypeField: "Funeral Date",
            occupancyTypeFieldValues: "",
            pattern: "\\d{4}([\\/-]\\d{2}){2}",
            isRequired: "",
            minimumLength: 10,
            maximumLength: 10,
            orderNumber: 11
        },
        session
    );

    addOccupancyTypeField(
        {
            occupancyTypeId: intermentOccupancyTypeId,
            occupancyTypeField: "Container Type",
            occupancyTypeFieldValues: "",
            pattern: "",
            isRequired: "",
            minimumLength: 1,
            maximumLength: 100,
            orderNumber: 20
        },
        session
    );

    addOccupancyTypeField(
        {
            occupancyTypeId: intermentOccupancyTypeId,
            occupancyTypeField: "Committal Type",
            occupancyTypeFieldValues: "",
            pattern: "",
            isRequired: "",
            minimumLength: 1,
            maximumLength: 100,
            orderNumber: 21
        },
        session
    );

    /*
     * Fee Categories
     */

    addFeeCategory(
        {
            feeCategory: "Interment Rights",
            orderNumber: 1
        },
        session
    );

    addFeeCategory(
        {
            feeCategory: "Cremation Services",
            orderNumber: 2
        },
        session
    );

    addFeeCategory(
        {
            feeCategory: "Burial Charges",
            orderNumber: 3
        },
        session
    );

    addFeeCategory(
        {
            feeCategory: "Disinterment of Human Remains",
            orderNumber: 4
        },
        session
    );

    addFeeCategory(
        {
            feeCategory: "Additional Services",
            orderNumber: 5
        },
        session
    );
};

initializeCemeteryDatabase();
