const recordIdColumns = new Map();
recordIdColumns.set("FeeCategories", "feeCategoryId");
recordIdColumns.set("Fees", "feeId");
recordIdColumns.set("LotOccupantTypes", "lotOccupantTypeId");
recordIdColumns.set("LotStatuses", "lotStatusId");
recordIdColumns.set("LotTypes", "lotTypeId");
recordIdColumns.set("LotTypeFields", "lotTypeFieldId");
recordIdColumns.set("OccupancyTypes", "occupancyTypeId");
recordIdColumns.set("OccupancyTypeFields", "occupancyTypeFieldId");
recordIdColumns.set("WorkOrderMilestoneTypes", "workOrderMilestoneTypeId");
recordIdColumns.set("WorkOrderTypes", "workOrderTypeId");
export function updateRecordOrderNumber(recordTable, recordId, orderNumber, connectedDatabase) {
    const result = connectedDatabase
        .prepare(`update ${recordTable}
                set orderNumber = ?
                where recordDelete_timeMillis is null
                and ${recordIdColumns.get(recordTable)} = ?`)
        .run(orderNumber, recordId);
    return result.changes > 0;
}
