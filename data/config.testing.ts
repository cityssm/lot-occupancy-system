import { config as cemeteryConfig } from './config.cemetery.ssm.js'

export const config = Object.assign({}, cemeteryConfig)

config.application.useTestDatabases = true

config.users = {
  testing: ['*testView', '*testUpdate', '*testAdmin'],
  canLogin: ['*testView', '*testUpdate', '*testAdmin'],
  canUpdate: ['*testUpdate'],
  isAdmin: ['*testAdmin']
}

export default config
