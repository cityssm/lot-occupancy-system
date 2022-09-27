import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
import { getMaps } from "../../helpers/lotOccupancyDB/getMaps.js";
import { getLotStatuses, getLotTypes } from "../../helpers/functions.cache.js";
export const handler = (_request, response) => {
    const rightNow = new Date();
    const maps = getMaps();
    const lotTypes = getLotTypes();
    const lotStatuses = getLotStatuses();
    response.render("report-search", {
        headTitle: "Reports",
        todayDateString: dateTimeFunctions.dateToString(rightNow),
        maps,
        lotTypes,
        lotStatuses
    });
};
export default handler;
