import { Router } from "express";

import * as permissionHandlers from "../handlers/permissions.js";

import handler_search from "../handlers/workOrders-get/search.js";
import handler_doSearchWorkOrders from "../handlers/workOrders-post/doSearchWorkOrders.js";

import handler_view from "../handlers/workOrders-get/view.js";
import handler_doReopenWorkOrder from "../handlers/workOrders-post/doReopenWorkOrder.js";

import handler_edit from "../handlers/workOrders-get/edit.js";
import handler_doUpdateWorkOrder from "../handlers/workOrders-post/doUpdateWorkOrder.js";
import handler_doDeleteWorkOrderLotOccupancy from "../handlers/workOrders-post/doDeleteWorkOrderLotOccupancy.js";
import handler_doDeleteWorkOrderLot from "../handlers/workOrders-post/doDeleteWorkOrderLot.js";

export const router = Router();

router.get("/", handler_search);

router.post("/doSearchWorkOrders", handler_doSearchWorkOrders);

router.get("/:workOrderId", handler_view);

router.post(
    "/doReopenWorkOrder",
    permissionHandlers.updatePostHandler,
    handler_doReopenWorkOrder
);

router.get(
    "/:workOrderId/edit",
    permissionHandlers.updateGetHandler,
    handler_edit
);

router.post(
    "/doUpdateWorkOrder",
    permissionHandlers.updatePostHandler,
    handler_doUpdateWorkOrder
);

router.post(
    "/doDeleteWorkOrderLotOccupancy",
    permissionHandlers.updatePostHandler,
    handler_doDeleteWorkOrderLotOccupancy
);

router.post(
    "/doDeleteWorkOrderLot",
    permissionHandlers.updatePostHandler,
    handler_doDeleteWorkOrderLot
);

export default router;
