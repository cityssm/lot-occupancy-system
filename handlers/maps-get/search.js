import * as configFunctions from "../../helpers/functions.config.js";
import { getMaps } from "../../helpers/lotOccupancyDB/getMaps.js";
export const handler = (_request, response) => {
    const maps = getMaps();
    response.render("map-search", {
        headTitle: configFunctions.getProperty("aliases.map") + " Search",
        maps
    });
};
export default handler;
