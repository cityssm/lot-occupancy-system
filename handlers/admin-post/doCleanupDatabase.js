import { cleanupDatabase } from '../../helpers/lotOccupancyDB/cleanupDatabase.js';
export async function handler(request, response) {
    const recordCounts = await cleanupDatabase(request.session.user);
    response.json({
        success: true,
        inactivatedRecordCount: recordCounts.inactivatedRecordCount,
        purgedRecordCount: recordCounts.purgedRecordCount
    });
}
export default handler;
