import { updateLot } from "../../helpers/lotOccupancyDB/updateLot.js";
export const handler = async (request, response) => {
    const success = updateLot(request.body, request.session);
    response.json({
        success,
        lotId: request.body.lotId
    });
};
export default handler;
