import { addMap } from '../../helpers/lotOccupancyDB/addMap.js';
export async function handler(request, response) {
    const mapId = await addMap(request.body, request.session);
    response.json({
        success: true,
        mapId
    });
}
export default handler;
