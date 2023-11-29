import { updateMap } from '../../helpers/lotOccupancyDB/updateMap.js';
export async function handler(request, response) {
    const success = await updateMap(request.body, request.session.user);
    response.json({
        success,
        mapId: request.body.mapId
    });
}
export default handler;
