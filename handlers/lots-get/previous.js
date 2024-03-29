import * as configFunctions from '../../helpers/functions.config.js';
import { getPreviousLotId } from '../../helpers/functions.lots.js';
export async function handler(request, response) {
    const lotId = Number.parseInt(request.params.lotId, 10);
    const previousLotId = await getPreviousLotId(lotId);
    if (previousLotId === undefined) {
        response.redirect(`${configFunctions.getProperty('reverseProxy.urlPrefix')}/lots/?error=noPreviousLotIdFound`);
        return;
    }
    response.redirect(`${configFunctions.getProperty('reverseProxy.urlPrefix')}/lots/${previousLotId.toString()}`);
}
export default handler;
