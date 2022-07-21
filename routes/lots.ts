import { Router } from "express";

import * as permissionHandlers from "../handlers/permissions.js";

import handler_search from "../handlers/lots-get/search.js";
import handler_doSearchLots from "../handlers/lots-post/doSearchLots.js";

import handler_view from "../handlers/lots-get/view.js";
import handler_new from "../handlers/lots-get/new.js";
import handler_edit from "../handlers/lots-get/edit.js";
import handler_print from "../handlers/lots-get/print.js";


export const router = Router();


/*
 * Lot Search
 */


router.get("/", 
  handler_search);
  
router.post("/doSearchLots", 
  handler_doSearchLots);


/*
 * Lot View / Edit
 */


router.get("/new",
  permissionHandlers.updateGetHandler,
  handler_new);



router.get("/:lotId",
  handler_view);


router.get("/:lotId/edit",
  permissionHandlers.updateGetHandler,
  handler_edit);


router.get("/:lotId/print",
  handler_print);


export default router;
