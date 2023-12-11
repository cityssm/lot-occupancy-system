import { Pool } from 'better-sqlite-pool';
import Debug from 'debug';
import exitHook from 'exit-hook';
import { lotOccupancyDB as databasePath } from '../data/databasePaths.js';
const debug = Debug('lot-occupancy-system:lotOccupancyDB:pool');
const pool = new Pool(databasePath);
export async function acquireConnection() {
    return await pool.acquire();
}
exitHook(() => {
    debug('Closing database pool');
    pool.close();
});
