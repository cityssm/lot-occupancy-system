import { getLotTypes } from '../../helpers/functions.cache.js';
import { getConfigProperty } from '../../helpers/functions.config.js';
export default async function handler(_request, response) {
    const lotTypes = await getLotTypes();
    response.render('admin-lotTypes', {
        headTitle: `${getConfigProperty('aliases.lot')} Type Management`,
        lotTypes
    });
}
