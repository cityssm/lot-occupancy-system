import { updateMap } from "../../helpers/lotOccupancyDB/updateMap.js";
export const handler = async (request, response) => {
    const success = updateMap(request.body, request.session);
    response.json({
        success,
        mapId: request.body.mapId
    });
};
export default handler;
