import { updateMap } from '../../helpers/lotOccupancyDB/updateMap.js';
export const handler = (request, response) => {
    const success = updateMap(request.body, request.session);
    response.json({
        success,
        mapId: request.body.mapId
    });
};
export default handler;
