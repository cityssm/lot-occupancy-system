import { Router } from "express";

import handler_search from "../handlers/reports-get/search.js";
import handler_reportName from "../handlers/reports-get/reportName.js";

export const router = Router();

router.get("/", handler_search);

router.all("/:reportName", handler_reportName);

export default router;
