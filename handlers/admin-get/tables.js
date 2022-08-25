import { getLotOccupantTypes, getLotStatuses, getWorkOrderTypes } from "../../helpers/functions.cache.js";
export const handler = (_request, response) => {
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
