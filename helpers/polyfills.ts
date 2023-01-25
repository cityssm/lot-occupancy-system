import hasOwn from 'object.hasown'

import Debug from 'debug'
const debug = Debug('lot-occupancy-system:polyfills')

export function applyPolyfills(): void {
  if (Object.hasOwn === undefined) {
    debug('Applying Object.hasOwn(o, v) polyfill')
    hasOwn.shim()
  }
}

applyPolyfills()

export default applyPolyfills
