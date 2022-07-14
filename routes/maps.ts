import { Router } from "express";

import * as permissionHandlers from "../handlers/permissions.js";
import * as configFunctions from "../helpers/functions.config.js";

import handler_new from "../handlers/maps-get/new.js";


export const router = Router();


router.get("/", (_request, response) => {

    response.render("map-search", {
        headTitle: configFunctions.getProperty("aliases.maps")
    });

});

router.get("/new",
    permissionHandlers.updateGetHandler,
    handler_new);



export default router;