import { addLotOccupancyTransaction } from '../../helpers/lotOccupancyDB/addLotOccupancyTransaction.js';
import { getLotOccupancyTransactions } from '../../helpers/lotOccupancyDB/getLotOccupancyTransactions.js';
export async function handler(request, response) {
    await addLotOccupancyTransaction(request.body, request.session);
    const lotOccupancyTransactions = await getLotOccupancyTransactions(request.body.lotOccupancyId, { includeIntegrations: true });
    response.json({
        success: true,
        lotOccupancyTransactions
    });
}
export default handler;
