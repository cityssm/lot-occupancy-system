import './helpers/polyfills.js';
import createError from 'http-errors';
import express from 'express';
import compression from 'compression';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import FileStore from 'session-file-store';
import * as permissionHandlers from './handlers/permissions.js';
import routerLogin from './routes/login.js';
import routerDashboard from './routes/dashboard.js';
import routerApi from './routes/api.js';
import routerPrint from './routes/print.js';
import routerMaps from './routes/maps.js';
import routerLots from './routes/lots.js';
import routerLotOccupancies from './routes/lotOccupancies.js';
import routerWorkOrders from './routes/workOrders.js';
import routerReports from './routes/reports.js';
import routerAdmin from './routes/admin.js';
import * as configFunctions from './helpers/functions.config.js';
import * as printFunctions from './helpers/functions.print.js';
import * as dateTimeFns from '@cityssm/expressjs-server-js/dateTimeFns.js';
import * as stringFns from '@cityssm/expressjs-server-js/stringFns.js';
import * as htmlFns from '@cityssm/expressjs-server-js/htmlFns.js';
import { version } from './version.js';
import * as databaseInitializer from './helpers/initializer.database.js';
import { apiGetHandler } from './handlers/permissions.js';
import { getSafeRedirectURL } from './helpers/functions.authentication.js';
import debug from 'debug';
import { useTestDatabases } from './data/databasePaths.js';
const debugApp = debug(`lot-occupancy-system:app:${process.pid}`);
databaseInitializer.initializeDatabase();
const _dirname = '.';
export const app = express();
app.disable('X-Powered-By');
if (!configFunctions.getProperty('reverseProxy.disableEtag')) {
    app.set('etag', false);
}
app.set('views', path.join(_dirname, 'views'));
app.set('view engine', 'ejs');
if (!configFunctions.getProperty('reverseProxy.disableCompression')) {
    app.use(compression());
}
app.use((request, _response, next) => {
    debugApp(`${request.method} ${request.url}`);
    next();
});
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(csurf({
    cookie: true
}));
app.use(rateLimit({
    windowMs: 10000,
    max: useTestDatabases ? 1000000 : 200
}));
const urlPrefix = configFunctions.getProperty('reverseProxy.urlPrefix');
if (urlPrefix !== '') {
    debugApp('urlPrefix = ' + urlPrefix);
}
app.use(urlPrefix, express.static(path.join('public')));
app.use(urlPrefix + '/lib/bulma-calendar', express.static(path.join('node_modules', 'bulma-calendar', 'dist')));
app.use(urlPrefix + '/lib/cityssm-bulma-js', express.static(path.join('node_modules', '@cityssm', 'bulma-js', 'dist')));
app.use(urlPrefix + '/lib/cityssm-bulma-webapp-js', express.static(path.join('node_modules', '@cityssm', 'bulma-webapp-js')));
app.use(urlPrefix + '/lib/fa', express.static(path.join('node_modules', '@fortawesome', 'fontawesome-free')));
app.use(urlPrefix + '/lib/leaflet', express.static(path.join('node_modules', 'leaflet', 'dist')));
app.use(urlPrefix + '/lib/randomcolor', express.static(path.join('node_modules', 'randomcolor')));
const sessionCookieName = configFunctions.getProperty('session.cookieName');
const FileStoreSession = FileStore(session);
app.use(session({
    store: new FileStoreSession({
        path: './data/sessions',
        logFn: debug('lot-occupancy-system:session'),
        retries: 20
    }),
    name: sessionCookieName,
    secret: configFunctions.getProperty('session.secret'),
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: configFunctions.getProperty('session.maxAgeMillis'),
        sameSite: 'strict'
    }
}));
app.use((request, response, next) => {
    if (Object.hasOwn(request.cookies, sessionCookieName) &&
        !Object.hasOwn(request.session, 'user')) {
        response.clearCookie(sessionCookieName);
    }
    next();
});
const sessionChecker = (request, response, next) => {
    if (Object.hasOwn(request.session, 'user') &&
        Object.hasOwn(request.cookies, sessionCookieName)) {
        next();
        return;
    }
    const redirectUrl = getSafeRedirectURL(request.originalUrl);
    response.redirect(`${urlPrefix}/login?redirect=${encodeURIComponent(redirectUrl)}`);
};
app.use((request, response, next) => {
    response.locals.buildNumber = version;
    response.locals.user = request.session.user;
    response.locals.csrfToken = request.csrfToken();
    response.locals.configFunctions = configFunctions;
    response.locals.printFunctions = printFunctions;
    response.locals.dateTimeFunctions = dateTimeFns;
    response.locals.stringFunctions = stringFns;
    response.locals.htmlFunctions = htmlFns;
    response.locals.urlPrefix = configFunctions.getProperty('reverseProxy.urlPrefix');
    next();
});
app.get(urlPrefix + '/', sessionChecker, (_request, response) => {
    response.redirect(urlPrefix + '/dashboard');
});
app.use(urlPrefix + '/dashboard', sessionChecker, routerDashboard);
app.use(urlPrefix + '/api/:apiKey', apiGetHandler, routerApi);
app.use(urlPrefix + '/print', sessionChecker, routerPrint);
app.use(urlPrefix + '/maps', sessionChecker, routerMaps);
app.use(urlPrefix + '/lots', sessionChecker, routerLots);
app.use(urlPrefix + '/lotOccupancies', sessionChecker, routerLotOccupancies);
app.use(urlPrefix + '/workOrders', sessionChecker, routerWorkOrders);
app.use(urlPrefix + '/reports', sessionChecker, routerReports);
app.use(urlPrefix + '/admin', sessionChecker, permissionHandlers.adminGetHandler, routerAdmin);
if (configFunctions.getProperty('session.doKeepAlive')) {
    app.all(urlPrefix + '/keepAlive', (_request, response) => {
        response.json(true);
    });
}
app.use(urlPrefix + '/login', routerLogin);
app.get(urlPrefix + '/logout', (request, response) => {
    if (Object.hasOwn(request.session, 'user') &&
        Object.hasOwn(request.cookies, sessionCookieName)) {
        request.session.destroy(() => {
            response.clearCookie(sessionCookieName);
            response.redirect(urlPrefix + '/');
        });
    }
    else {
        response.redirect(urlPrefix + '/login');
    }
});
app.use((request, _response, next) => {
    debugApp(request.url);
    next(createError(404, 'File not found.'));
});
export default app;
