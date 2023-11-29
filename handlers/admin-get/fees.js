import { getFeeCategories } from '../../database/getFeeCategories.js';
import { getLotTypes, getOccupancyTypes } from '../../helpers/functions.cache.js';
export async function handler(_request, response) {
    const feeCategories = await getFeeCategories({}, {
        includeFees: true
    });
    const occupancyTypes = await getOccupancyTypes();
    const lotTypes = await getLotTypes();
    response.render('admin-fees', {
        headTitle: 'Fee Management',
        feeCategories,
        occupancyTypes,
        lotTypes
    });
}
export default handler;
