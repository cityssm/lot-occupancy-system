import { backupDatabase } from '../../helpers/functions.database.js';
export async function handler(_request, response) {
    const backupDatabasePath = await backupDatabase();
    if (typeof backupDatabasePath === 'string') {
        const backupDatabasePathSplit = backupDatabasePath.split(/[/\\]/g);
        const fileName = backupDatabasePathSplit[backupDatabasePathSplit.length - 1];
        response.json({
            success: true,
            fileName
        });
    }
    else {
        response.json({
            success: false,
            errorMessage: 'Unable to write backup file.'
        });
    }
}
export default handler;
