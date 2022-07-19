export const handler = (_request, response) => {
    response.render("lot-edit", {
        headTitle: "Licence Create",
        isCreate: true
    });
};
export default handler;
