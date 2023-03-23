import cluster from 'node:cluster'
import hasOwn from 'object.hasown'

import Debug from 'debug'
const debug = Debug('lot-occupancy-system:polyfills')

export function applyPolyfills(): void {
  if (Object.hasOwn === undefined) {
    debug('Applying Object.hasOwn(o, v) polyfill')
    Object.hasOwn = hasOwn
  }

  if (!Object.hasOwn(cluster, 'setupPrimary') && Object.hasOwn(cluster, 'setupMaster')) {
    debug('Applying cluster.setupPrimary() polyfill')
    cluster.setupPrimary = cluster.setupMaster
  }
}

applyPolyfills()

export default applyPolyfills
