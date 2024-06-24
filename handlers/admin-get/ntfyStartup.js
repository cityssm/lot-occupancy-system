import * as configFunctions from '../../helpers/functions.config.js';
export default function handler(_request, response) {
    if (configFunctions.getConfigProperty('application.ntfyStartup') === undefined) {
        response.redirect(configFunctions.getConfigProperty('reverseProxy.urlPrefix') +
            '/dashboard/?error=ntfyNotConfigured');
        return;
    }
    response.render('admin-ntfyStartup', {
        headTitle: 'Ntfy Startup Notification'
    });
}
