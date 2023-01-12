import sqlite from 'better-sqlite3';
import type * as recordTypes from '../../types/recordTypes';
export declare function getLotComments(lotId: number | string, connectedDatabase?: sqlite.Database): recordTypes.LotComment[];
export default getLotComments;
