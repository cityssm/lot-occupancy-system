import type { Config } from '../types/configTypes'

export const config: Config = {
  application: {},
  session: {},
  reverseProxy: {},
  users: {},
  aliases: {},
  settings: {
    fees: {},
    map: {},
    lot: {},
    lotOccupancy: {},
    workOrders: {},
    adminCleanup: {},
    printPdf: {},
    dynamicsGP: {
      integrationIsEnabled: false
    }
  }
}

export default config
