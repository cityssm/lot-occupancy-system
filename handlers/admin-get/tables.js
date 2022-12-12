import { getLotOccupantTypes, getLotStatuses, getWorkOrderMilestoneTypes, getWorkOrderTypes } from "../../helpers/functions.cache.js";
import { getSolidIconClasses } from "../../helpers/functions.icons.js";
export const handler = async (_request, response) => {
    const workOrderTypes = getWorkOrderTypes();
    const workOrderMilestoneTypes = getWorkOrderMilestoneTypes();
    const lotStatuses = getLotStatuses();
    const lotOccupantTypes = getLotOccupantTypes();
    const fontAwesomeIconClasses = await getSolidIconClasses();
    response.render("admin-tables", {
        headTitle: "Config Table Management",
        workOrderTypes,
        workOrderMilestoneTypes,
        lotStatuses,
        lotOccupantTypes,
        fontAwesomeIconClasses
    });
};
export default handler;
