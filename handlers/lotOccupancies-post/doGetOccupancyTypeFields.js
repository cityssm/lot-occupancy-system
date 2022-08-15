import { getOccupancyTypeById } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const result = getOccupancyTypeById(Number.parseInt(request.body.occupancyTypeId, 10));
    response.json({
        occupancyTypeFields: result.occupancyTypeFields
    });
};
export default handler;
