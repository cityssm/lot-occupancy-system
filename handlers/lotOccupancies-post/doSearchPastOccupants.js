import { getPastLotOccupancyOccupants } from '../../helpers/lotOccupancyDB/getPastLotOccupancyOccupants.js';
export async function handler(request, response) {
    const occupants = await getPastLotOccupancyOccupants(request.body, {
        limit: Number.parseInt(request.body.limit, 10)
    });
    response.json({
        occupants
    });
}
export default handler;
