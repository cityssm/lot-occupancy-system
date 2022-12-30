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

function initializeCemeteryDatabase() {
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
            lotOccupantType: "Funeral Director",
            orderNumber: 2
        },
        session
    );

    addLotOccupantType(
        {
            lotOccupantType: "Preneed Owner",
            orderNumber: 3
        },
        session
    );

    addLotOccupantType(
        {
            lotOccupantType: "Purchaser",
            orderNumber: 4
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

    const cremationOccupancyTypeId = addOccupancyType(
        {
            occupancyType: "Cremation",
            orderNumber: 3
        },
        session
    );

    // Death Date
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

    addOccupancyTypeField(
        Object.assign(deathDateField, { occupancyTypeId: cremationOccupancyTypeId }),
        session
    );

    // Death Age
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

    addOccupancyTypeField(
        Object.assign(deathAgeField, { occupancyTypeId: cremationOccupancyTypeId }),
        session
    );

    // Death Age Period
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

    addOccupancyTypeField(
        Object.assign(deathAgePeriod, { occupancyTypeId: cremationOccupancyTypeId }),
        session
    );

    // Death Place
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

    addOccupancyTypeField(
        Object.assign(deathPlace, { occupancyTypeId: cremationOccupancyTypeId }),
        session
    );

    // Funeral Home
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

    addOccupancyTypeField(
        Object.assign(funeralHome, { occupancyTypeId: cremationOccupancyTypeId }),
        session
    );

    // Funeral Date
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

    addOccupancyTypeField(
        Object.assign(funeralDate, { occupancyTypeId: cremationOccupancyTypeId }),
        session
    );

    // Container Type
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

    addOccupancyTypeField(
        Object.assign(containerType, { occupancyTypeId: cremationOccupancyTypeId }),
        session
    );

    // Committal Type
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

    addOccupancyTypeField(
        Object.assign(committalType, { occupancyTypeId: cremationOccupancyTypeId }),
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
}

initializeCemeteryDatabase();
