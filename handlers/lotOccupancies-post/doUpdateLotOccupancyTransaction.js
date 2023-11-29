import { getLotOccupancyTransactions } from '../../helpers/lotOccupancyDB/getLotOccupancyTransactions.js';
import { updateLotOccupancyTransaction } from '../../helpers/lotOccupancyDB/updateLotOccupancyTransaction.js';
export async function handler(request, response) {
    await updateLotOccupancyTransaction(request.body, request.session.user);
    const lotOccupancyTransactions = await getLotOccupancyTransactions(request.body.lotOccupancyId, { includeIntegrations: true });
    response.json({
        success: true,
        lotOccupancyTransactions
    });
}
export default handler;
