import sqlite from 'better-sqlite3';
import type * as recordTypes from '../../types/recordTypes';
export declare function getFee(feeId: number | string, connectedDatabase?: sqlite.Database): recordTypes.Fee;
export default getFee;
