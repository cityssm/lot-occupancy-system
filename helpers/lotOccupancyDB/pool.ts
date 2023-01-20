import { Pool, PoolConnection } from 'better-sqlite-pool'

import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js'

import exitHook from 'exit-hook'

import Debug from 'debug'
const debug = Debug('lot-occupancy-system:lotOccupancyDB:pool')

const pool = new Pool(databasePath)

export async function acquireConnection(): Promise<PoolConnection> {
  const connection = await pool.acquire()
  return connection
}

exitHook(() => {
  debug('Closing database pool')
  pool.close()
})
