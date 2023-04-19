import { updateLotOccupancyTransaction } from '../../helpers/lotOccupancyDB/updateLotOccupancyTransaction.js';
import { getLotOccupancyTransactions } from '../../helpers/lotOccupancyDB/getLotOccupancyTransactions.js';
export async function handler(request, response) {
    await updateLotOccupancyTransaction(request.body, request.session);
    const lotOccupancyTransactions = await getLotOccupancyTransactions(request.body.lotOccupancyId, { includeIntegrations: true });
    response.json({
        success: true,
        lotOccupancyTransactions
    });
}
export default handler;
