import * as configFunctions from '../../helpers/functions.config.js';
export function handler(_request, response) {
    if (!configFunctions.getProperty('application.ntfyStartup')) {
        response.redirect(configFunctions.getProperty('reverseProxy.urlPrefix') +
            '/dashboard/?error=ntfyNotConfigured');
        return;
    }
    response.render('admin-ntfyStartup', {
        headTitle: 'Ntfy Startup Notification'
    });
}
export default handler;
