import sqlite from 'better-sqlite3';
import type * as recordTypes from '../../types/recordTypes';
export declare function getLotOccupancyFields(lotOccupancyId: number | string, connectedDatabase?: sqlite.Database): recordTypes.LotOccupancyField[];
export default getLotOccupancyFields;
