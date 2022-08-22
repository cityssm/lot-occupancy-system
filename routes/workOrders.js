import { Router } from "express";
import handler_search from "../handlers/workOrders-get/search.js";
export const router = Router();
router.get("/", handler_search);
export default router;
