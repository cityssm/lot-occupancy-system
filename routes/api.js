import { Router } from "express";
import handler_milestoneICS from "../handlers/api-get/milestoneICS.js";
export const router = Router();
router.get("/milestoneICS", handler_milestoneICS);
export default router;
