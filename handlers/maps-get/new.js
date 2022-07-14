import * as configFunctions from "../../helpers/functions.config.js";
export const handler = (_request, response) => {
    const map = {};
    response.render("map-edit", {
        headTitle: configFunctions.getProperty("aliases.map") + " Create",
        isCreate: true,
        map
    });
};
export default handler;
