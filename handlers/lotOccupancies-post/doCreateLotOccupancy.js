import { addLotOccupancy } from "../../helpers/lotOccupancyDB/addLotOccupancy.js";
export const handler = async (request, response) => {
    const lotOccupancyId = addLotOccupancy(request.body, request.session);
    response.json({
        success: true,
        lotOccupancyId
    });
};
export default handler;
