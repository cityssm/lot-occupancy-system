import { moveRecordDown, moveRecordDownToBottom } from "../../helpers/lotOccupancyDB/moveRecord.js";
import { getAllOccupancyTypeFields, getOccupancyTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = request.body.moveToEnd === "1"
        ? moveRecordDownToBottom("OccupancyTypes", request.body.occupancyTypeId)
        : moveRecordDown("OccupancyTypes", request.body.occupancyTypeId);
    const occupancyTypes = getOccupancyTypes();
    const allOccupancyTypeFields = getAllOccupancyTypeFields();
    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
};
export default handler;
