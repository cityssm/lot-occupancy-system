import path from 'node:path'

import type { ServiceConfig } from 'node-windows'

const _dirname = '.'

export const serviceConfig: ServiceConfig = {
  name: 'Lot Occupancy Manager',
  description:
    'A system for managing the occupancy of lots. (i.e. Cemetery management)',
  script: path.join(_dirname, 'bin', 'www.js')
}
