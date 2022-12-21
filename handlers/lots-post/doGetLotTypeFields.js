import { getLotTypeById } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const lotType = getLotTypeById(Number.parseInt(request.body.lotTypeId, 10));
    response.json({
        lotTypeFields: lotType.lotTypeFields
    });
};
export default handler;
