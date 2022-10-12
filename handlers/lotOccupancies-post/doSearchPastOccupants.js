import { getPastLotOccupancyOccupants } from "../../helpers/lotOccupancyDB/getPastLotOccupancyOccupants.js";
export const handler = (request, response) => {
    const occupants = getPastLotOccupancyOccupants(request.body, {
        limit: Number.parseInt(request.body.limit, 10)
    });
    response.json({
        occupants
    });
};
export default handler;
