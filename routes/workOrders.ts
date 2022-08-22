import { Router } from "express";

import * as permissionHandlers from "../handlers/permissions.js";
import * as configFunctions from "../helpers/functions.config.js";

import handler_search from "../handlers/workOrders-get/search.js";


export const router = Router();


router.get("/",
    handler_search);


export default router;
