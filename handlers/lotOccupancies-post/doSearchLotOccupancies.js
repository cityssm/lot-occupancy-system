import { getLotOccupancies } from "../../helpers/lotOccupancyDB/getLotOccupancies.js";
export const handler = async (request, response) => {
    const result = getLotOccupancies(request.body, {
        limit: request.body.limit,
        offset: request.body.offset,
        includeOccupants: true
    });
    response.json({
        count: result.count,
        lotOccupancies: result.lotOccupancies
    });
};
export default handler;
