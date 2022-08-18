import { deleteLotOccupancy } from "../../helpers/lotOccupancyDB/deleteLotOccupancy.js";
export const handler = async (request, response) => {
    const success = deleteLotOccupancy(request.body.lotOccupancyId, request.session);
    response.json({
        success
    });
};
export default handler;
