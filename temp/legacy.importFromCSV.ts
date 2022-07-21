/* eslint-disable node/no-extraneous-import, node/no-unpublished-import */

import fs from "node:fs";
import papa from "papaparse";

import sqlite from "better-sqlite3";
import {
    lotOccupancyDB as databasePath
} from "../data/databasePaths.js";

import * as cacheFunctions from "../helpers/functions.cache.js";

import {
    addMap
} from "../helpers/lotOccupancyDB/addMap.js";
import {
    getMap as getMapFromDatabase
} from "../helpers/lotOccupancyDB/getMap.js";

import {
    addLot
} from "../helpers/lotOccupancyDB/addLot.js";
import {
    updateLotStatus
} from "../helpers/lotOccupancyDB/updateLot.js";

import {
    getOccupants
} from "../helpers/lotOccupancyDB/getOccupants.js";
import {
    addOccupant
} from "../helpers/lotOccupancyDB/addOccupant.js";
import {
    addLotOccupancy
} from "../helpers/lotOccupancyDB/addLotOccupancy.js";
import {
    addLotOccupancyOccupant
} from "../helpers/lotOccupancyDB/addLotOccupancyOccupant.js";

import type * as recordTypes from "../types/recordTypes";


interface MasterRecord {
    CM_SYSREC: string;
    CM_CEMETERY: string;
    CM_BLOCK: string;
    CM_RANGE1: string;
    CM_RANGE2: string;
    CM_LOT1: string;
    CM_LOT2: string;
    CM_GRAVE1: number;
    CM_GRAVE2: string;
    CM_INTERMENT: string;
    CM_PRENEED_OWNER: string;
    CM_PRENEED_OWNER_SEQ: string;
    CM_DECEASED_NAME: string;
    CM_DECEASED_NAME_SEQ: string;
    CM_ADDRESS: string;
    CM_CITY: string;
    CM_PROV: string;
    CM_POST1: string;
    CM_POST2: string;
    CM_PRENEED_ORDER: string;
    CM_PURCHASE_YR: string;
    CM_PURCHASE_MON: string;
    CM_PURCHASE_DAY: string;
    CM_NO_GRAVES: string;
    CM_DEATH_YR: string;
    CM_DEATH_MON: string;
    CM_DEATH_DAY: string;
    CM_WORK_ORDER: string;
    CM_INTERMENT_YR: string;
    CM_INTERMENT_MON: string;
    CM_INTERMENT_DAY: string;
    CM_AGE: string;
    CM_CONTAINER_TYPE: string;
    CM_COMMITTAL_TYPE: string;
    CM_CREMATION: string;
    CM_FUNERAL_HOME: string;
    CM_FUNERAL_YR: string;
    CM_FUNERAL_MON: string;
    CM_FUNERAL_DAY: string;
    CM_RESIDENT_TYPE: string;
    CM_REMARK1: string;
    CM_REMARK2: string;
    CM_STATUS: string;
    CM_PERIOD: string;
    CM_LAST_CHG_DATE: string;
    CM_DEPTH: string;
}


const user: recordTypes.PartialSession = {
    user: {
        userName: "import.unix",
        userProperties: {
            canUpdate: true,
            isAdmin: false
        }
    }
};


function purgeTables() {
    const database = sqlite(databasePath);
    database.prepare("delete from LotOccupancyOccupants").run();
    database.prepare("delete from LotOccupancies").run();
    database.prepare("delete from Occupants").run();
    database.prepare("delete from Lots").run();
    database.prepare("delete from sqlite_sequence where name in ('Lots', 'LotOccupancies', 'Occupants')").run();
    database.close();
}


function purgeConfigTables() {
    const database = sqlite(databasePath);
    database.prepare("delete from Maps").run();
    database.prepare("delete from sqlite_sequence where name in ('Maps')").run();
    database.close();
}


function getMapByMapDescription(mapDescription: string) {

    const database = sqlite(databasePath, {
        readonly: true
    });

    const map: recordTypes.Map = database
        .prepare("select * from Maps" +
            " where mapDescription = ?")
        .get(mapDescription);

    database.close();

    return map;
}

function formatDateString(year: string, month: string, day: string) {

    return ("0000" + year).slice(-4) + "-" +
        ("00" + month).slice(-2) + "-" +
        ("00" + day).slice(-2);
}


const mapCache: Map < string, recordTypes.Map > = new Map();


function getMap(masterRow: MasterRecord): recordTypes.Map {

    if (mapCache.has(masterRow.CM_CEMETERY)) {
        return mapCache.get(masterRow.CM_CEMETERY);
    }

    let map = getMapByMapDescription(masterRow.CM_CEMETERY);

    if (!map) {

        console.log("Creating map: " + masterRow.CM_CEMETERY);

        const mapId = addMap({
            mapName: masterRow.CM_CEMETERY,
            mapDescription: masterRow.CM_CEMETERY,
            mapSVG: "",
            mapLatitude: "",
            mapLongitude: "",
            mapAddress1: "",
            mapAddress2: "",
            mapCity: "Sault Ste. Marie",
            mapProvince: "ON",
            mapPostalCode: "",
            mapPhoneNumber: ""
        }, user);

        map = getMapFromDatabase(mapId);
    }

    mapCache.set(masterRow.CM_CEMETERY, map);

    return map;
}


function importFromCSV() {

    let masterRow: MasterRecord;

    // Load cached values
    const lotTypes = cacheFunctions.getLotTypes();

    const availableLotStatus = cacheFunctions.getLotStatusByLotStatus("Available");

    const preneedOccupancyType = cacheFunctions.getOccupancyTypeByOccupancyType("Preneed");
    const preneedOwnerLotOccupantType = cacheFunctions.getLotOccupantTypesByLotOccupantType("Preneed Owner");
    const reservedLotStatus = cacheFunctions.getLotStatusByLotStatus("Reserved");

    const deceasedOccupancyType = cacheFunctions.getOccupancyTypeByOccupancyType("Interment");
    const deceasedLotOccupantType = cacheFunctions.getLotOccupantTypesByLotOccupantType("Deceased");
    const takenLotStatus = cacheFunctions.getLotStatusByLotStatus("Taken");

    const rawData = fs.readFileSync("./temp/CMMASTER.csv").toString();

    const cmmaster: papa.ParseResult < MasterRecord > = papa.parse(rawData, {
        delimiter: ",",
        header: true,
        skipEmptyLines: true
    });

    for (const parseError of cmmaster.errors) {
        console.log(parseError);
    }

    try {
        for (masterRow of cmmaster.data) {

            const map = getMap(masterRow);

            const lotName = masterRow.CM_CEMETERY + "-" +
                (masterRow.CM_BLOCK === "" ? "" : masterRow.CM_BLOCK + "-") +
                (masterRow.CM_RANGE1 === "0" && masterRow.CM_RANGE2 === "" ?
                    "" :
                    (masterRow.CM_RANGE2 === "" ?
                        masterRow.CM_RANGE1 :
                        masterRow.CM_RANGE2) + "-") +
                masterRow.CM_LOT1 + masterRow.CM_LOT2 + "-" +
                masterRow.CM_GRAVE1 + masterRow.CM_GRAVE2 + "-" +
                masterRow.CM_INTERMENT;

            const lotId = addLot({
                lotName: lotName,
                lotTypeId: lotTypes[0].lotTypeId,
                lotStatusId: availableLotStatus.lotStatusId,
                mapId: map.mapId,
                mapKey: lotName,
                lotLatitude: "",
                lotLongitude: ""
            }, user);

            if (masterRow.CM_PRENEED_ORDER) {

                const occupantPostalCode = ((masterRow.CM_POST1 || "") + " " + (masterRow.CM_POST2 || "")).trim();

                const possibleOccupants = getOccupants({
                    occupantName: masterRow.CM_PRENEED_OWNER,
                    occupantAddress: masterRow.CM_ADDRESS,
                    occupantCity: masterRow.CM_CITY,
                    occupantPostalCode
                });

                const occupantId = possibleOccupants.length > 0 ?
                    possibleOccupants[0].occupantId :
                    addOccupant({
                        occupantName: masterRow.CM_PRENEED_ORDER,
                        occupantAddress1: masterRow.CM_ADDRESS,
                        occupantAddress2: "",
                        occupantCity: masterRow.CM_CITY,
                        occupantProvince: masterRow.CM_PROV,
                        occupantPostalCode,
                        occupantPhoneNumber: ""
                    }, user);

                let occupancyStartDateString = formatDateString(masterRow.CM_PURCHASE_YR,
                    masterRow.CM_PURCHASE_MON,
                    masterRow.CM_PURCHASE_DAY);

                let occupancyEndDateString = "";

                if (masterRow.CM_INTERMENT_YR !== "" && masterRow.CM_INTERMENT_YR !== "0") {
                    occupancyEndDateString = formatDateString(masterRow.CM_INTERMENT_YR,
                        masterRow.CM_INTERMENT_MON,
                        masterRow.CM_INTERMENT_DAY);
                }

                // if purchase date unavailable
                if (occupancyStartDateString === "0000-00-00" && occupancyEndDateString !== "") {
                    occupancyStartDateString = occupancyEndDateString;
                }

                // if end date unavailable
                if (occupancyStartDateString === "0000-00-00" && masterRow.CM_DEATH_YR !== "" && masterRow.CM_DEATH_YR !== "0") {
                    occupancyStartDateString = formatDateString(masterRow.CM_DEATH_YR,
                        masterRow.CM_DEATH_MON,
                        masterRow.CM_DEATH_DAY);
                }

                if (occupancyStartDateString === "" || occupancyStartDateString === "0000-00-00") {
                    occupancyStartDateString = "0001-01-01";
                }

                const lotOccupancyId = addLotOccupancy({
                    occupancyTypeId: preneedOccupancyType.occupancyTypeId,
                    lotId,
                    occupancyStartDateString,
                    occupancyEndDateString
                }, user);

                addLotOccupancyOccupant({
                    lotOccupancyId,
                    lotOccupantTypeId: preneedOwnerLotOccupantType.lotOccupantTypeId,
                    occupantId
                }, user);

                if (occupancyEndDateString === "") {
                    updateLotStatus(lotId, reservedLotStatus.lotStatusId, user);
                }
            }

            if (masterRow.CM_DECEASED_NAME) {

                const deceasedPostalCode = ((masterRow.CM_POST1 || "") + " " + (masterRow.CM_POST2 || "")).trim();

                const occupantId = addOccupant({
                    occupantName: masterRow.CM_DECEASED_NAME,
                    occupantAddress1: masterRow.CM_ADDRESS,
                    occupantAddress2: "",
                    occupantCity: masterRow.CM_CITY,
                    occupantProvince: masterRow.CM_PROV,
                    occupantPostalCode: deceasedPostalCode,
                    occupantPhoneNumber: ""
                }, user);

                let occupancyStartDateString = formatDateString(masterRow.CM_INTERMENT_YR,
                    masterRow.CM_INTERMENT_MON,
                    masterRow.CM_INTERMENT_DAY);

                const occupancyEndDateString = "";

                // if interment date unavailable
                if (occupancyStartDateString === "0000-00-00" && masterRow.CM_DEATH_YR !== "" && masterRow.CM_DEATH_YR !== "0") {
                    occupancyStartDateString = formatDateString(masterRow.CM_DEATH_YR,
                        masterRow.CM_DEATH_MON,
                        masterRow.CM_DEATH_DAY);
                }

                if (occupancyStartDateString === "" || occupancyStartDateString === "0000-00-00") {
                    occupancyStartDateString = "0001-01-01";
                }

                const lotOccupancyId = addLotOccupancy({
                    occupancyTypeId: deceasedOccupancyType.occupancyTypeId,
                    lotId,
                    occupancyStartDateString,
                    occupancyEndDateString
                }, user);

                addLotOccupancyOccupant({
                    lotOccupancyId,
                    lotOccupantTypeId: deceasedLotOccupantType.lotOccupantTypeId,
                    occupantId
                }, user);

                updateLotStatus(lotId, takenLotStatus.lotStatusId, user);
            }
        }
    } catch (error) {
        console.error(error)
        console.log(masterRow);
    }
}

purgeTables();
// purgeConfigTables();
importFromCSV();