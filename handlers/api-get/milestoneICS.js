import ical, { ICalEventStatus } from "ical-generator";
import { getWorkOrderMilestones } from "../../helpers/lotOccupancyDB/getWorkOrderMilestones.js";
const timeStringSplitRegex = /[ :-]/;
export const handler = (request, response) => {
    const workOrderMilestones = getWorkOrderMilestones({
        workOrderMilestoneDateFilter: "recent",
        workOrderTypeIds: request.query.workOrderTypeIds,
        workOrderMilestoneTypeIds: request.query
            .workOrderMilestoneTypeIds
    }, { includeWorkOrders: true, orderBy: "date" });
    const calendar = ical({
        name: "Work Order Milestone Calendar"
    });
    for (const milestone of workOrderMilestones) {
        const milestoneTimePieces = (milestone.workOrderMilestoneDateString +
            " " +
            milestone.workOrderMilestoneTimeString).split(timeStringSplitRegex);
        const milestoneDate = new Date(Number.parseInt(milestoneTimePieces[0], 10), Number.parseInt(milestoneTimePieces[1], 10) - 1, Number.parseInt(milestoneTimePieces[2], 10), Number.parseInt(milestoneTimePieces[3], 10), Number.parseInt(milestoneTimePieces[4], 10));
        const eventData = {
            start: milestoneDate,
            stamp: new Date(milestone.recordCreate_timeMillis),
            lastModified: new Date(milestone.recordUpdate_timeMillis),
            allDay: !milestone.workOrderMilestoneTime,
            summary: milestone.workOrderMilestoneDescription
        };
        const calendarEvent = calendar.createEvent(eventData);
        if (milestone.workOrderMilestoneCompletionDate) {
            calendarEvent.status(ICalEventStatus.CONFIRMED);
        }
        if (milestone.workOrderMilestoneTypeId) {
            calendarEvent.createCategory({
                name: milestone.workOrderMilestoneType
            });
        }
        if (milestone.workOrder.workOrderLots.length > 0) {
            const lotNames = [];
            for (const lot of milestone.workOrder.workOrderLots) {
                lotNames.push(lot.mapName + ": " + lot.lotName);
            }
            calendarEvent.location(lotNames.join(", "));
        }
        if (milestone.workOrder.workOrderLotOccupancies.length > 0) {
            for (const lotOccupancy of milestone.workOrder
                .workOrderLotOccupancies) {
                for (const occupants of lotOccupancy.lotOccupancyOccupants) {
                    calendarEvent.createAttendee({
                        name: occupants.occupantName,
                        email: "no-reply@example.com"
                    });
                }
            }
        }
    }
    calendar.serve(response);
};
export default handler;
