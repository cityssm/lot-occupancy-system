import fs from 'node:fs/promises';
import { lotOccupancyDB as databasePath, backupFolder } from '../data/databasePaths.js';
export const backupDatabase = async () => {
    const databasePathSplit = databasePath.split(/[/\\]/g);
    const backupDatabasePath = backupFolder +
        '/' +
        databasePathSplit[databasePathSplit.length - 1] +
        '.' +
        Date.now().toString();
    try {
        await fs.copyFile(databasePath, backupDatabasePath);
        return backupDatabasePath;
    }
    catch {
        return false;
    }
};
