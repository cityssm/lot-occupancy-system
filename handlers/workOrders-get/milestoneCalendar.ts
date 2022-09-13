import type { RequestHandler } from "express";

export const handler: RequestHandler = (request, response) => {
    response.render("workOrder-milestoneCalendar", {
        headTitle: "Work Order Milestone Calendar"
    });
};

export default handler;
