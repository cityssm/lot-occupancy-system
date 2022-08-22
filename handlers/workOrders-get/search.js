export const handler = (request, response) => {
    response.render("workOrder-search", {
        headTitle: "Work Order Search"
    });
};
export default handler;
