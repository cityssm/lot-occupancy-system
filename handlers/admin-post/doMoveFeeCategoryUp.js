import { moveRecordUp, moveRecordUpToTop } from '../../helpers/lotOccupancyDB/moveRecord.js';
import { getFeeCategories } from '../../helpers/lotOccupancyDB/getFeeCategories.js';
export async function handler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordUpToTop('FeeCategories', request.body.feeCategoryId)
        : await moveRecordUp('FeeCategories', request.body.feeCategoryId);
    const feeCategories = await getFeeCategories({}, {
        includeFees: true
    });
    response.json({
        success,
        feeCategories
    });
}
export default handler;
