import { moveLotTypeFieldUp, moveLotTypeFieldUpToTop } from '../../helpers/lotOccupancyDB/moveLotTypeField.js';
import { getLotTypes } from '../../helpers/functions.cache.js';
export const handler = (request, response) => {
    const success = request.body.moveToEnd === '1'
        ? moveLotTypeFieldUpToTop(request.body.lotTypeFieldId)
        : moveLotTypeFieldUp(request.body.lotTypeFieldId);
    const lotTypes = getLotTypes();
    response.json({
        success,
        lotTypes
    });
};
export default handler;
