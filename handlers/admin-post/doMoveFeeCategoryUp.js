import { moveRecordUp, moveRecordUpToTop } from '../../database/moveRecord.js';
import { getFeeCategories } from '../../database/getFeeCategories.js';
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
