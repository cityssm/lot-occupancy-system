import { cleanupDatabase } from "../../helpers/lotOccupancyDB/cleanupDatabase.js";
export const handler = async (request, response) => {
    const recordCounts = cleanupDatabase(request.session);
    response.json({
        success: true,
        inactivedRecordCount: recordCounts.inactivedRecordCount,
        purgedRecordCount: recordCounts.purgedRecordCount
    });
};
export default handler;
