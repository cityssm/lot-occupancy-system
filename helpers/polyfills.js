import Debug from 'debug';
const debug = Debug('lot-occupancy-system:polyfills');
export function applyPolyfills() {
    if (Object.hasOwn === undefined) {
        debug('Applying Object.hasOwn(o, v) polyfill');
        Object.hasOwn = Object.prototype.hasOwnProperty.call;
    }
}
applyPolyfills();
export default applyPolyfills;
