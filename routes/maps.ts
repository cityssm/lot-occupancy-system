import {
  Router
} from "express";

import * as permissionHandlers from "../handlers/permissions.js";

import handler_search from "../handlers/maps-get/search.js";

import handler_view from "../handlers/maps-get/view.js";
import handler_new from "../handlers/maps-get/new.js";
import handler_edit from "../handlers/maps-get/edit.js";

import handler_doCreateMap from "../handlers/maps-post/doCreateMap.js";
import handler_doUpdateMap from "../handlers/maps-post/doUpdateMap.js";


export const router = Router();


router.get("/",
  handler_search);


router.get("/new",
  permissionHandlers.updateGetHandler,
  handler_new);


router.get("/:mapId",
  handler_view);


router.get("/:mapId/edit",
  permissionHandlers.updateGetHandler,
  handler_edit);


router.post("/doCreateMap",
  permissionHandlers.updatePostHandler,
  handler_doCreateMap);


router.post("/doUpdateMap",
  permissionHandlers.updatePostHandler,
  handler_doUpdateMap);


export default router;