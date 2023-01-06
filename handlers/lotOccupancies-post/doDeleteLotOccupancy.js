import { deleteRecord } from "../../helpers/lotOccupancyDB/deleteRecord.js";
export const handler = async (request, response) => {
    const success = deleteRecord("LotOccupancies", request.body.lotOccupancyId, request.session);
    response.json({
        success
    });
};
export default handler;
