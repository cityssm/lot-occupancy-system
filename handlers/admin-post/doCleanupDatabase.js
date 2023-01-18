import { cleanupDatabase } from '../../helpers/lotOccupancyDB/cleanupDatabase.js';
export async function handler(request, response) {
    const recordCounts = await cleanupDatabase(request.session);
    response.json({
        success: true,
        inactivedRecordCount: recordCounts.inactivedRecordCount,
        purgedRecordCount: recordCounts.purgedRecordCount
    });
}
export default handler;
