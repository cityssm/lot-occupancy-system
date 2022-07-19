export const handler = (_request, response) => {
    return response.render("lot-edit", {
        headTitle: "Licence Update",
        isCreate: false
    });
};
export default handler;
