import { addMap } from "../../helpers/lotOccupancyDB/addMap.js";
export const handler = async (request, response) => {
    const mapId = addMap(request.body, request.session);
    response.json({
        success: true,
        mapId
    });
};
export default handler;
