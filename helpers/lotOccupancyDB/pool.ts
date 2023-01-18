import { Pool, PoolConnection } from 'better-sqlite-pool'

import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js'

const pool = new Pool(databasePath)

export async function acquireConnection(): Promise<PoolConnection> {
  return await pool.acquire()
}
