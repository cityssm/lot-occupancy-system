import type {
    RequestHandler
} from "express";

import { getLotOccupantTypes, getLotStatuses, getWorkOrderTypes } from "../../helpers/functions.cache.js";


export const handler: RequestHandler = (_request, response) => {

    const workOrderTypes = getWorkOrderTypes();
    const lotStatuses = getLotStatuses();
    const lotOccupantTypes = getLotOccupantTypes();

    response.render("admin-tables", {
        headTitle: "Config Table Management",
        workOrderTypes,
        lotStatuses,
        lotOccupantTypes
    });
};


export default handler;