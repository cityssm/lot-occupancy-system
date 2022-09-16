import { Router } from "express";

import * as permissionHandlers from "../handlers/permissions.js";

// Fee Management

import handler_fees from "../handlers/admin-get/fees.js";

import handler_doAddFeeCategory from "../handlers/admin-post/doAddFeeCategory.js";
import handler_doUpdateFeeCategory from "../handlers/admin-post/doUpdateFeeCategory.js";
import handler_doMoveFeeCategoryUp from "../handlers/admin-post/doMoveFeeCategoryUp.js";
import handler_doMoveFeeCategoryDown from "../handlers/admin-post/doMoveFeeCategoryDown.js";
import handler_doDeleteFeeCategory from "../handlers/admin-post/doDeleteFeeCategory.js";

import handler_doAddFee from "../handlers/admin-post/doAddFee.js";
import handler_doUpdateFee from "../handlers/admin-post/doUpdateFee.js";
import handler_doMoveFeeUp from "../handlers/admin-post/doMoveFeeUp.js";
import handler_doMoveFeeDown from "../handlers/admin-post/doMoveFeeDown.js";
import handler_doDeleteFee from "../handlers/admin-post/doDeleteFee.js";

// Occupancy Type Management

import handler_occupancyTypes from "../handlers/admin-get/occupancyTypes.js";

import handler_doAddOccupancyType from "../handlers/admin-post/doAddOccupancyType.js";
import handler_doUpdateOccupancyType from "../handlers/admin-post/doUpdateOccupancyType.js";
import handler_doMoveOccupancyTypeUp from "../handlers/admin-post/doMoveOccupancyTypeUp.js";
import handler_doMoveOccupancyTypeDown from "../handlers/admin-post/doMoveOccupancyTypeDown.js";
import handler_doDeleteOccupancyType from "../handlers/admin-post/doDeleteOccupancyType.js";

import handler_doAddOccupancyTypeField from "../handlers/admin-post/doAddOccupancyTypeField.js";
import handler_doUpdateOccupancyTypeField from "../handlers/admin-post/doUpdateOccupancyTypeField.js";
import handler_doDeleteOccupancyTypeField from "../handlers/admin-post/doDeleteOccupancyTypeField.js";

// Config Table Management

import handler_tables from "../handlers/admin-get/tables.js";

import handler_doAddWorkOrderType from "../handlers/admin-post/doAddWorkOrderType.js";
import handler_doUpdateWorkOrderType from "../handlers/admin-post/doUpdateWorkOrderType.js";
import handler_doMoveWorkOrderTypeUp from "../handlers/admin-post/doMoveWorkOrderTypeUp.js";
import handler_doMoveWorkOrderTypeDown from "../handlers/admin-post/doMoveWorkOrderTypeDown.js";
import handler_doDeleteWorkOrderType from "../handlers/admin-post/doDeleteWorkOrderType.js";

import handler_doAddWorkOrderMilestoneType from "../handlers/admin-post/doAddWorkOrderMilestoneType.js";
import handler_doUpdateWorkOrderMilestoneType from "../handlers/admin-post/doUpdateWorkOrderMilestoneType.js";
import handler_doMoveWorkOrderMilestoneTypeUp from "../handlers/admin-post/doMoveWorkOrderMilestoneTypeUp.js";
import handler_doMoveWorkOrderMilestoneTypeDown from "../handlers/admin-post/doMoveWorkOrderMilestoneTypeDown.js";
import handler_doDeleteWorkOrderMilestoneType from "../handlers/admin-post/doDeleteWorkOrderMilestoneType.js";

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

/*
 * Fees
 */

router.get("/fees", permissionHandlers.adminGetHandler, handler_fees);

router.post(
    "/doAddFeeCategory",
    permissionHandlers.adminPostHandler,
    handler_doAddFeeCategory
);

router.post(
    "/doUpdateFeeCategory",
    permissionHandlers.adminPostHandler,
    handler_doUpdateFeeCategory
);

router.post(
    "/doMoveFeeCategoryUp",
    permissionHandlers.adminPostHandler,
    handler_doMoveFeeCategoryUp
);

router.post(
    "/doMoveFeeCategoryDown",
    permissionHandlers.adminPostHandler,
    handler_doMoveFeeCategoryDown
);

router.post(
    "/doDeleteFeeCategory",
    permissionHandlers.adminPostHandler,
    handler_doDeleteFeeCategory
);

router.post("/doAddFee", permissionHandlers.adminPostHandler, handler_doAddFee);

router.post(
    "/doUpdateFee",
    permissionHandlers.adminPostHandler,
    handler_doUpdateFee
);

router.post(
    "/doMoveFeeUp",
    permissionHandlers.adminPostHandler,
    handler_doMoveFeeUp
);

router.post(
    "/doMoveFeeDown",
    permissionHandlers.adminPostHandler,
    handler_doMoveFeeDown
);

router.post(
    "/doDeleteFee",
    permissionHandlers.adminPostHandler,
    handler_doDeleteFee
);

/*
 * Occupancy Type Management
 */

router.get(
    "/occupancyTypes",
    permissionHandlers.adminGetHandler,
    handler_occupancyTypes
);

router.post(
    "/doAddOccupancyType",
    permissionHandlers.adminPostHandler,
    handler_doAddOccupancyType
);

router.post(
    "/doUpdateOccupancyType",
    permissionHandlers.adminPostHandler,
    handler_doUpdateOccupancyType
);

router.post(
    "/doMoveOccupancyTypeUp",
    permissionHandlers.adminPostHandler,
    handler_doMoveOccupancyTypeUp
);

router.post(
    "/doMoveOccupancyTypeDown",
    permissionHandlers.adminPostHandler,
    handler_doMoveOccupancyTypeDown
);

router.post(
    "/doDeleteOccupancyType",
    permissionHandlers.adminPostHandler,
    handler_doDeleteOccupancyType
);

// Occupancy Type Fields

router.post(
    "/doAddOccupancyTypeField",
    permissionHandlers.adminPostHandler,
    handler_doAddOccupancyTypeField
);

router.post(
    "/doUpdateOccupancyTypeField",
    permissionHandlers.adminPostHandler,
    handler_doUpdateOccupancyTypeField
);

router.post(
    "/doDeleteOccupancyTypeField",
    permissionHandlers.adminPostHandler,
    handler_doDeleteOccupancyTypeField
);

/*
 * Config Tables
 */

router.get("/tables", permissionHandlers.adminGetHandler, handler_tables);

// Config Tables - Work Order Types

router.post(
    "/doAddWorkOrderType",
    permissionHandlers.adminPostHandler,
    handler_doAddWorkOrderType
);

router.post(
    "/doUpdateWorkOrderType",
    permissionHandlers.adminPostHandler,
    handler_doUpdateWorkOrderType
);

router.post(
    "/doMoveWorkOrderTypeUp",
    permissionHandlers.adminPostHandler,
    handler_doMoveWorkOrderTypeUp
);

router.post(
    "/doMoveWorkOrderTypeDown",
    permissionHandlers.adminPostHandler,
    handler_doMoveWorkOrderTypeDown
);

router.post(
    "/doDeleteWorkOrderType",
    permissionHandlers.adminPostHandler,
    handler_doDeleteWorkOrderType
);
// Config Tables - Work Order Milestone Types

router.post(
    "/doAddWorkOrderMilestoneType",
    permissionHandlers.adminPostHandler,
    handler_doAddWorkOrderMilestoneType
);

router.post(
    "/doUpdateWorkOrderMilestoneType",
    permissionHandlers.adminPostHandler,
    handler_doUpdateWorkOrderMilestoneType
);

router.post(
    "/doMoveWorkOrderMilestoneTypeUp",
    permissionHandlers.adminPostHandler,
    handler_doMoveWorkOrderMilestoneTypeUp
);

router.post(
    "/doMoveWorkOrderMilestoneTypeDown",
    permissionHandlers.adminPostHandler,
    handler_doMoveWorkOrderMilestoneTypeDown
);

router.post(
    "/doDeleteWorkOrderMilestoneType",
    permissionHandlers.adminPostHandler,
    handler_doDeleteWorkOrderMilestoneType
);

// Config Tables - Lot Statuses

router.post(
    "/doAddLotStatus",
    permissionHandlers.adminPostHandler,
    handler_doAddLotStatus
);

router.post(
    "/doUpdateLotStatus",
    permissionHandlers.adminPostHandler,
    handler_doUpdateLotStatus
);

router.post(
    "/doMoveLotStatusUp",
    permissionHandlers.adminPostHandler,
    handler_doMoveLotStatusUp
);

router.post(
    "/doMoveLotStatusDown",
    permissionHandlers.adminPostHandler,
    handler_doMoveLotStatusDown
);

router.post(
    "/doDeleteLotStatus",
    permissionHandlers.adminPostHandler,
    handler_doDeleteLotStatus
);

// Config Tables - Lot Occupant Types

router.post(
    "/doAddLotOccupantType",
    permissionHandlers.adminPostHandler,
    handler_doAddLotOccupantType
);

router.post(
    "/doUpdateLotOccupantType",
    permissionHandlers.adminPostHandler,
    handler_doUpdateLotOccupantType
);

router.post(
    "/doMoveLotOccupantTypeUp",
    permissionHandlers.adminPostHandler,
    handler_doMoveLotOccupantTypeUp
);

router.post(
    "/doMoveLotOccupantTypeDown",
    permissionHandlers.adminPostHandler,
    handler_doMoveLotOccupantTypeDown
);

router.post(
    "/doDeleteLotOccupantType",
    permissionHandlers.adminPostHandler,
    handler_doDeleteLotOccupantType
);

export default router;
