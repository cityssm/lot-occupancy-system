import * as configFunctions from "../../helpers/functions.config.js";
import { getMaps } from "../../helpers/lotOccupancyDB/getMaps.js";
import * as cacheFunctions from "../../helpers/functions.cache.js";
export const handler = (_request, response) => {
    const lot = {
        lotOccupancies: []
    };
    const maps = getMaps();
    const lotTypes = cacheFunctions.getLotTypes();
    const lotStatuses = cacheFunctions.getLotStatuses();
    response.render("lot-edit", {
        headTitle: "Create a New " + configFunctions.getProperty("aliases.lot"),
        lot,
        isCreate: true,
        maps,
        lotTypes,
        lotStatuses
    });
};
export default handler;
