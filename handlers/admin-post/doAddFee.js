import addFee from '../../database/addFee.js';
import getFeeCategories from '../../database/getFeeCategories.js';
export default async function handler(request, response) {
    const feeId = await addFee(request.body, request.session.user);
    const feeCategories = await getFeeCategories({}, {
        includeFees: true
    });
    response.json({
        success: true,
        feeId,
        feeCategories
    });
}
