import {
    Router
} from "express";

import * as permissionHandlers from "../handlers/permissions.js";

import handler_fees from "../handlers/admin-get/fees.js";
import handler_doAddFeeCategory from "../handlers/admin-post/doAddFeeCategory.js";
import handler_doUpdateFeeCategory from "../handlers/admin-post/doUpdateFeeCategory.js";
import handler_doDeleteFeeCategory from "../handlers/admin-post/doDeleteFeeCategory.js";

import handler_doAddFee from "../handlers/admin-post/doAddFee.js";
import handler_doUpdateFee from "../handlers/admin-post/doUpdateFee.js";
import handler_doDeleteFee from "../handlers/admin-post/doDeleteFee.js";

import handler_tables from "../handlers/admin-get/tables.js";

import handler_doAddWorkOrderType from "../handlers/admin-post/doAddWorkOrderType.js";
import handler_doUpdateWorkOrderType from "../handlers/admin-post/doUpdateWorkOrderType.js";
import handler_doMoveWorkOrderTypeUp from "../handlers/admin-post/doMoveWorkOrderTypeUp.js";
import handler_doMoveWorkOrderTypeDown from "../handlers/admin-post/doMoveWorkOrderTypeDown.js";
import handler_doDeleteWorkOrderType from "../handlers/admin-post/doDeleteWorkOrderType.js";

import handler_doAddLotStatus from "../handlers/admin-post/doAddLotStatus.js";
import handler_doUpdateLotStatus from "../handlers/admin-post/doUpdateLotStatus.js";
import handler_doMoveLotStatusUp from "../handlers/admin-post/doMoveLotStatusUp.js";
import handler_doMoveLotStatusDown from "../handlers/admin-post/doMoveLotStatusDown.js";
import handler_doDeleteLotStatus from "../handlers/admin-post/doDeleteLotStatus.js";

import handler_doAddLotOccupantType from "../handlers/admin-post/doAddLotOccupantType.js";
import handler_doUpdateLotOccupantType from "../handlers/admin-post/doUpdateLotOccupantType.js";
import handler_doMoveLotOccupantTypeUp from "../handlers/admin-post/doMoveLotOccupantTypeUp.js";
import handler_doMoveLotOccupantTypeDown from "../handlers/admin-post/doMoveLotOccupantTypeDown.js";
import handler_doDeleteLotOccupantType from "../handlers/admin-post/doDeleteLotOccupantType.js";


export const router = Router();


// Fees

router.get("/fees",
    permissionHandlers.adminGetHandler,
    handler_fees);

router.post("/doAddFeeCategory",
    permissionHandlers.adminPostHandler,
    handler_doAddFeeCategory);

router.post("/doUpdateFeeCategory",
    permissionHandlers.adminPostHandler,
    handler_doUpdateFeeCategory);

router.post("/doDeleteFeeCategory",
    permissionHandlers.adminPostHandler,
    handler_doDeleteFeeCategory);

router.post("/doAddFee",
    permissionHandlers.adminPostHandler,
    handler_doAddFee);

router.post("/doUpdateFee",
    permissionHandlers.adminPostHandler,
    handler_doUpdateFee);

router.post("/doDeleteFee",
    permissionHandlers.adminPostHandler,
    handler_doDeleteFee);

// Config Tables

router.get("/tables",
    permissionHandlers.adminGetHandler,
    handler_tables);

// Config Tables - Work Order Types

router.post("/doAddWorkOrderType",
    permissionHandlers.adminPostHandler,
    handler_doAddWorkOrderType);

router.post("/doUpdateWorkOrderType",
    permissionHandlers.adminPostHandler,
    handler_doUpdateWorkOrderType);

router.post("/doMoveWorkOrderTypeUp",
    permissionHandlers.adminPostHandler,
    handler_doMoveWorkOrderTypeUp);

router.post("/doMoveWorkOrderTypeDown",
    permissionHandlers.adminPostHandler,
    handler_doMoveWorkOrderTypeDown);

router.post("/doDeleteWorkOrderType",
    permissionHandlers.adminPostHandler,
    handler_doDeleteWorkOrderType);

// Config Tables - Lot Statuses

router.post("/doAddLotStatus",
    permissionHandlers.adminPostHandler,
    handler_doAddLotStatus);

router.post("/doUpdateLotStatus",
    permissionHandlers.adminPostHandler,
    handler_doUpdateLotStatus);

router.post("/doMoveLotStatusUp",
    permissionHandlers.adminPostHandler,
    handler_doMoveLotStatusUp);

router.post("/doMoveLotStatusDown",
    permissionHandlers.adminPostHandler,
    handler_doMoveLotStatusDown);

router.post("/doDeleteLotStatus",
    permissionHandlers.adminPostHandler,
    handler_doDeleteLotStatus);

// Config Tables - Lot Occupant Types

router.post("/doAddLotOccupantType",
    permissionHandlers.adminPostHandler,
    handler_doAddLotOccupantType);

router.post("/doUpdateLotOccupantType",
    permissionHandlers.adminPostHandler,
    handler_doUpdateLotOccupantType);

router.post("/doMoveLotOccupantTypeUp",
    permissionHandlers.adminPostHandler,
    handler_doMoveLotOccupantTypeUp);

router.post("/doMoveLotOccupantTypeDown",
    permissionHandlers.adminPostHandler,
    handler_doMoveLotOccupantTypeDown);

router.post("/doDeleteLotOccupantType",
    permissionHandlers.adminPostHandler,
    handler_doDeleteLotOccupantType);


export default router;