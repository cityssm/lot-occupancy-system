import { getNextMapId } from '../../database/getNextMapId.js';
import * as configFunctions from '../../helpers/functions.config.js';
export async function handler(request, response) {
    const mapId = Number.parseInt(request.params.mapId, 10);
    const nextMapId = await getNextMapId(mapId);
    if (nextMapId === undefined) {
        response.redirect(`${configFunctions.getConfigProperty('reverseProxy.urlPrefix')}/maps/?error=noNextMapIdFound`);
        return;
    }
    response.redirect(`${configFunctions.getConfigProperty('reverseProxy.urlPrefix')}/maps/${nextMapId.toString()}`);
}
export default handler;
