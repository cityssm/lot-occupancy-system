/* eslint-disable node/no-extraneous-import, node/no-unpublished-import */

import fs from "node:fs";
import papa from "papaparse";

import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../data/databasePaths.js";

import { addMap } from "../helpers/lotOccupancyDB/addMap.js";
import { getMap as getMapFromDatabase } from "../helpers/lotOccupancyDB/getMap.js";

import { getLotTypes } from "../helpers/lotOccupancyDB/getLotTypes.js";
import { addLot } from "../helpers/lotOccupancyDB/addLot.js";

import type * as recordTypes from "../types/recordTypes";


interface MasterRecord {
    CM_SYSREC: string;
    CM_CEMETERY: string;
    CM_BLOCK: string;
    CM_RANGE1: number;
    CM_RANGE2: string;
    CM_LOT1: number;
    CM_LOT2: string;
    CM_GRAVE1: number;
    CM_GRAVE2: string;
    CM_INTERMENT: number;
    CM_PRENEED_OWNER: string;
    CM_PRENEED_OWNER_SEQ: number;
    CM_DECEASED_NAME: string;
    CM_DECEASED_NAME_SEQ: number;
    CM_ADDRESS: string; 
    CM_CITY: string; 
    CM_PROV: string; 
    CM_POST1: string; 
    CM_POST2: string; 
    CM_PRENEED_ORDER: string; 
    CM_PURCHASE_YR: number; 
    CM_PURCHASE_MON: number; 
    CM_PURCHASE_DAY: number; 
    CM_NO_GRAVES: number; 
    CM_DEATH_YR: number;
    CM_DEATH_MON: number; 
    CM_DEATH_DAY: number; 
    CM_WORK_ORDER: string; 
    CM_INTERMENT_YR: number;
    CM_INTERMENT_MON: number;
    CM_INTERMENT_DAY: number;
    CM_AGE: number;
    CM_CONTAINER_TYPE: string;
    CM_COMMITTAL_TYPE: string;
    CM_CREMATION: string;
    CM_FUNERAL_HOME: string;
    CM_FUNERAL_YR: number;
    CM_FUNERAL_MON: number;
    CM_FUNERAL_DAY: number;
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

const configTablesInString = "'Maps', 'LotTypes'";


function purgeTables () {
    const database = sqlite(databasePath);
    database.prepare("delete from Lots").run();
    database.prepare("delete from sqlite_sequence where name not in (" + configTablesInString + ")").run();
    database.close();
}


function purgeConfigTables () {
    const database = sqlite(databasePath);
    database.prepare("delete from Maps").run();
    database.prepare("delete from sqlite_sequence where name in ('Maps')").run();
    database.close();
}


function getMapByMapDescription (mapDescription: string) {

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


const mapCache: Map<string, recordTypes.Map> = new Map();


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


function importFromCSV () {

    const lotTypes = getLotTypes();

    const rawData = fs.readFileSync("./temp/CMMASTER.csv").toString();

    const cmmaster: papa.ParseResult<MasterRecord> = papa.parse(rawData, {
        delimiter: ",",
        header: true,
        skipEmptyLines: true
    });

    for (const parseError of cmmaster.errors) {
        console.log(parseError);
    }

    for (const masterRow of cmmaster.data) {
        const map = getMap(masterRow);

        const lotName = masterRow.CM_CEMETERY + "-" +
            (masterRow.CM_BLOCK === "" ? "" : masterRow.CM_BLOCK + "-") +
            (masterRow.CM_RANGE2 === "" ? masterRow.CM_RANGE1.toString() : masterRow.CM_RANGE2) + "-" +
            (masterRow.CM_LOT2 === "" ? masterRow.CM_LOT1.toString() : masterRow.CM_LOT2) + "-" +
            (masterRow.CM_GRAVE2 === "" ? masterRow.CM_GRAVE1.toString() : masterRow.CM_GRAVE2) + "-" +
            masterRow.CM_INTERMENT;

        const lotId = addLot({
            lotName: lotName,
            lotTypeId: lotTypes[0].lotTypeId,
            lotTypeStatusId: "",
            mapId: map.mapId,
            mapKey: lotName,
            lotLatitude: "",
            lotLongitude: ""
        }, user);
    }
}

purgeTables();
// purgeMaps();
importFromCSV();