export const handler = (request, response) => {
    response.render("workOrder-milestoneCalendar", {
        headTitle: "Work Order Milestone Calendar"
    });
};
export default handler;
