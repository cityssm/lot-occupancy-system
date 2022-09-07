import { Router } from "express";

import * as permissionHandlers from "../handlers/permissions.js";

import handler_search from "../handlers/workOrders-get/search.js";
import handler_doSearchWorkOrders from "../handlers/workOrders-post/doSearchWorkOrders.js";

import handler_view from "../handlers/workOrders-get/view.js";

import handler_edit from "../handlers/workOrders-get/edit.js";

export const router = Router();

router.get("/", handler_search);

router.post("/doSearchWorkOrders", handler_doSearchWorkOrders);

router.get("/:workOrderId", handler_view);

router.get("/:workOrderId/edit",
    permissionHandlers.updateGetHandler,
    handler_edit);

export default router;
