import { getWorkOrderMilestoneTypes, getWorkOrderTypes } from "../../helpers/functions.cache.js";
export const handler = (request, response) => {
    const workOrderTypes = getWorkOrderTypes();
    const workOrderMilestoneTypes = getWorkOrderMilestoneTypes();
    response.render("workOrder-outlook", {
        headTitle: "Work Order Outlook Integration",
        workOrderTypes,
        workOrderMilestoneTypes
    });
};
export default handler;
