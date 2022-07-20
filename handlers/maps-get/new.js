import * as configFunctions from "../../helpers/functions.config.js";
import { getMapSVGs } from "../../helpers/functions.map.js";
export const handler = async (_request, response) => {
    const map = {};
    const mapSVGs = await getMapSVGs();
    response.render("map-edit", {
        headTitle: configFunctions.getProperty("aliases.map") + " Create",
        isCreate: true,
        map,
        mapSVGs
    });
};
export default handler;
