import sqlite from "better-sqlite3";
export declare const getNextWorkOrderNumber: (connectedDatabase?: sqlite.Database) => string;
export default getNextWorkOrderNumber;
