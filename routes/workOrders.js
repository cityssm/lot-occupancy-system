import { Router } from "express";
import handler_search from "../handlers/workOrders-get/search.js";
import handler_doSearchWorkOrders from "../handlers/workOrders-post/doSearchWorkOrders.js";
import handler_view from "../handlers/workOrders-get/view.js";
export const router = Router();
router.get("/", handler_search);
router.post("/doSearchWorkOrders", handler_doSearchWorkOrders);
router.get("/:workOrderId", handler_view);
export default router;
