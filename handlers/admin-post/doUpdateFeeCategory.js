import getFeeCategories from '../../database/getFeeCategories.js';
import { updateFeeCategory } from '../../database/updateFeeCategory.js';
export default async function handler(request, response) {
    const success = await updateFeeCategory(request.body, request.session.user);
    const feeCategories = await getFeeCategories({}, {
        includeFees: true
    });
    response.json({
        success,
        feeCategories
    });
}
