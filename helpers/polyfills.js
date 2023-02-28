import cluster from 'node:cluster';
import hasOwn from 'object.hasown';
import Debug from 'debug';
const debug = Debug('lot-occupancy-system:polyfills');
export function applyPolyfills() {
    if (Object.hasOwn === undefined) {
        debug('Applying Object.hasOwn(o, v) polyfill');
        Object.hasOwn = hasOwn;
    }
    if (cluster.setupPrimary === undefined && cluster.setupMaster !== undefined) {
        debug('Applying cluster.setupPrimary() polyfill');
        cluster.setupPrimary = cluster.setupMaster;
    }
}
applyPolyfills();
export default applyPolyfills;
