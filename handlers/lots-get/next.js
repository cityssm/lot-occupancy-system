import * as configFunctions from '../../helpers/functions.config.js';
import { getNextLotId } from '../../helpers/functions.lots.js';
export async function handler(request, response) {
    const lotId = Number.parseInt(request.params.lotId, 10);
    const nextLotId = await getNextLotId(lotId);
    if (nextLotId === undefined) {
        response.redirect(`${configFunctions.getProperty('reverseProxy.urlPrefix')}/lots/?error=noNextLotIdFound`);
        return;
    }
    response.redirect(`${configFunctions.getProperty('reverseProxy.urlPrefix')}/lots/${nextLotId.toString()}`);
}
export default handler;
