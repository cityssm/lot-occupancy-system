import { getPreviousMapId } from '../../database/getPreviousMapId.js';
import * as configFunctions from '../../helpers/functions.config.js';
export async function handler(request, response) {
    const mapId = Number.parseInt(request.params.mapId, 10);
    const previousMapId = await getPreviousMapId(mapId);
    if (previousMapId === undefined) {
        response.redirect(`${configFunctions.getConfigProperty('reverseProxy.urlPrefix')}/maps/?error=noPreviousMapIdFound`);
        return;
    }
    response.redirect(`${configFunctions.getConfigProperty('reverseProxy.urlPrefix')}/maps/${previousMapId.toString()}`);
}
export default handler;
