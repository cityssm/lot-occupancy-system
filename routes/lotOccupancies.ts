import {
    Router
} from "express";

import handler_search from "../handlers/lotOccupancies-get/search.js";
import handler_doSearchLotOccupancies from "../handlers/lotOccupancies-post/doSearchLotOccupancies.js";

import handler_view from "../handlers/lotOccupancies-get/view.js";
import handler_edit from "../handlers/lotOccupancies-get/edit.js";

import * as permissionHandlers from "../handlers/permissions.js";


export const router = Router();


router.get("/",
    handler_search);


router.post("/doSearchLotOccupancies",
    handler_doSearchLotOccupancies);


 router.get("/:lotOccupancyId",
    handler_view);


router.get("/:lotOccupancyId/edit",
    permissionHandlers.updateGetHandler,
    handler_edit);


export default router;