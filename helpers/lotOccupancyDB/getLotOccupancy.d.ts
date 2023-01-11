import sqlite from 'better-sqlite3';
import type * as recordTypes from '../../types/recordTypes';
export declare function getLotOccupancy(lotOccupancyId: number | string, connectedDatabase?: sqlite.Database): recordTypes.LotOccupancy | undefined;
export default getLotOccupancy;
