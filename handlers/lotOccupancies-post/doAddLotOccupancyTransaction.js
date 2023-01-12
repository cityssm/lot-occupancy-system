import { addLotOccupancyTransaction } from '../../helpers/lotOccupancyDB/addLotOccupancyTransaction.js';
import { getLotOccupancyTransactions } from '../../helpers/lotOccupancyDB/getLotOccupancyTransactions.js';
export const handler = (request, response) => {
    addLotOccupancyTransaction(request.body, request.session);
    const lotOccupancyTransactions = getLotOccupancyTransactions(request.body.lotOccupancyId);
    response.json({
        success: true,
        lotOccupancyTransactions
    });
};
export default handler;
