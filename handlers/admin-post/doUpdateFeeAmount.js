import getFeeCategories from '../../database/getFeeCategories.js';
import { updateFeeAmount } from '../../database/updateFee.js';
export default async function handler(request, response) {
    const success = await updateFeeAmount(request.body, request.session.user);
    const feeCategories = await getFeeCategories({}, {
        includeFees: true
    });
    response.json({
        success,
        feeCategories
    });
}
