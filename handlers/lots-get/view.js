import * as configFunctions from "../../helpers/functions.config.js";
const urlPrefix = configFunctions.getProperty("reverseProxy.urlPrefix");
export const handler = (_request, response) => {
    return response.render("lot-view", {
        headTitle: "Licence View"
    });
};
export default handler;
