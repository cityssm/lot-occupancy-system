import addFeeCategory from '../../database/addFeeCategory.js';
import getFeeCategories from '../../database/getFeeCategories.js';
export default async function handler(request, response) {
    const feeCategoryId = await addFeeCategory(request.body, request.session.user);
    const feeCategories = await getFeeCategories({}, {
        includeFees: true
    });
    response.json({
        success: true,
        feeCategoryId,
        feeCategories
    });
}
