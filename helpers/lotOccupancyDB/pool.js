import { Pool } from 'better-sqlite-pool';
import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js';
const pool = new Pool(databasePath);
export async function acquireConnection() {
    return await pool.acquire();
}
