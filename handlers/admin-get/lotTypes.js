import { getLotTypes } from '../../helpers/functions.cache.js';
import * as configFunctions from '../../helpers/functions.config.js';
export async function handler(_request, response) {
    const lotTypes = await getLotTypes();
    response.render('admin-lotTypes', {
        headTitle: configFunctions.getProperty('aliases.lot') + ' Type Management',
        lotTypes
    });
}
export default handler;
