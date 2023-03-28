import { getLots } from '../../helpers/lotOccupancyDB/getLots.js';
export async function handler(request, response) {
    const result = await getLots(request.body, {
        limit: request.body.limit,
        offset: request.body.offset,
        includeLotOccupancyCount: true
    });
    response.json({
        count: result.count,
        offset: Number.parseInt(request.body.offset, 10),
        lots: result.lots
    });
}
export default handler;
