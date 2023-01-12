import { addMap } from '../../helpers/lotOccupancyDB/addMap.js';
export const handler = (request, response) => {
    const mapId = addMap(request.body, request.session);
    response.json({
        success: true,
        mapId
    });
};
export default handler;
