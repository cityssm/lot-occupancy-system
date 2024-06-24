import { deleteRecord } from '../../database/deleteRecord.js';
import { getFeeCategories } from '../../database/getFeeCategories.js';
export default async function handler(request, response) {
    const success = await deleteRecord('FeeCategories', request.body.feeCategoryId, request.session.user);
    const feeCategories = await getFeeCategories({}, {
        includeFees: true
    });
    response.json({
        success,
        feeCategories
    });
}
