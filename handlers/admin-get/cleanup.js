export const handler = (_request, response) => {
    response.render("admin-cleanup", {
        headTitle: "Database Cleanup"
    });
};
export default handler;
