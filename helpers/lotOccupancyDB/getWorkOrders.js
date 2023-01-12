import sqlite from 'better-sqlite3';
import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js';
import { dateIntegerToString, dateStringToInteger } from '@cityssm/expressjs-server-js/dateTimeFns.js';
import { getWorkOrderComments } from './getWorkOrderComments.js';
import { getLots } from './getLots.js';
import { getLotOccupancies } from './getLotOccupancies.js';
import { getWorkOrderMilestones } from './getWorkOrderMilestones.js';
import { getLotNameWhereClause, getOccupantNameWhereClause } from '../functions.sqlFilters.js';
function buildWhereClause(filters) {
    let sqlWhereClause = ' where w.recordDelete_timeMillis is null';
    const sqlParameters = [];
    if ((filters.workOrderTypeId ?? '') !== '') {
        sqlWhereClause += ' and w.workOrderTypeId = ?';
        sqlParameters.push(filters.workOrderTypeId);
    }
    if ((filters.workOrderOpenStatus ?? '') !== '') {
        if (filters.workOrderOpenStatus === 'open') {
            sqlWhereClause += ' and w.workOrderCloseDate is null';
        }
        else if (filters.workOrderOpenStatus === 'closed') {
            sqlWhereClause += ' and w.workOrderCloseDate is not null';
        }
    }
    if ((filters.workOrderOpenDateString ?? '') !== '') {
        sqlWhereClause += ' and w.workOrderOpenDate = ?';
        sqlParameters.push(dateStringToInteger(filters.workOrderOpenDateString));
    }
    const occupantNameFilters = getOccupantNameWhereClause(filters.occupantName, 'o');
    if (occupantNameFilters.sqlParameters.length > 0) {
        sqlWhereClause +=
            ' and w.workOrderId in (' +
                'select workOrderId from WorkOrderLotOccupancies o' +
                ' where recordDelete_timeMillis is null' +
                ' and o.lotOccupancyId in (select lotOccupancyId from LotOccupancyOccupants o where recordDelete_timeMillis is null' +
                occupantNameFilters.sqlWhereClause +
                ')' +
                ')';
        sqlParameters.push(...occupantNameFilters.sqlParameters);
    }
    const lotNameFilters = getLotNameWhereClause(filters.lotName, '', 'l');
    if (lotNameFilters.sqlParameters.length > 0) {
        sqlWhereClause +=
            ' and w.workOrderId in (' +
                'select workOrderId from WorkOrderLots where recordDelete_timeMillis is null and lotId in (select lotId from Lots l where recordDelete_timeMillis is null' +
                lotNameFilters.sqlWhereClause +
                '))';
        sqlParameters.push(...lotNameFilters.sqlParameters);
    }
    if (filters.lotOccupancyId) {
        sqlWhereClause +=
            ' and w.workOrderId in (select workOrderId from WorkOrderLotOccupancies where recordDelete_timeMillis is null and lotOccupancyId = ?)';
        sqlParameters.push(filters.lotOccupancyId);
    }
    return {
        sqlWhereClause,
        sqlParameters
    };
}
export function getWorkOrders(filters, options, connectedDatabase) {
    const database = connectedDatabase ??
        sqlite(databasePath, {
            readonly: true
        });
    database.function('userFn_dateIntegerToString', dateIntegerToString);
    const { sqlWhereClause, sqlParameters } = buildWhereClause(filters);
    const count = database
        .prepare('select count(*) as recordCount from WorkOrders w' + sqlWhereClause)
        .get(sqlParameters).recordCount;
    let workOrders = [];
    if (count > 0) {
        workOrders = database
            .prepare('select w.workOrderId,' +
            ' w.workOrderTypeId, t.workOrderType,' +
            ' w.workOrderNumber, w.workOrderDescription,' +
            ' w.workOrderOpenDate, userFn_dateIntegerToString(w.workOrderOpenDate) as workOrderOpenDateString,' +
            ' w.workOrderCloseDate, userFn_dateIntegerToString(w.workOrderCloseDate) as workOrderCloseDateString,' +
            ' ifnull(m.workOrderMilestoneCount, 0) as workOrderMilestoneCount,' +
            ' ifnull(m.workOrderMilestoneCompletionCount, 0) as workOrderMilestoneCompletionCount' +
            ' from WorkOrders w' +
            ' left join WorkOrderTypes t on w.workOrderTypeId = t.workOrderTypeId' +
            (' left join (select workOrderId,' +
                ' count(workOrderMilestoneId) as workOrderMilestoneCount,' +
                ' sum(case when workOrderMilestoneCompletionDate is null then 0 else 1 end) as workOrderMilestoneCompletionCount' +
                ' from WorkOrderMilestones' +
                ' where recordDelete_timeMillis is null' +
                ' group by workOrderId) m on w.workOrderId = m.workOrderId') +
            sqlWhereClause +
            ' order by w.workOrderOpenDate desc, w.workOrderNumber desc' +
            (options
                ? ` limit ${options.limit} offset ${options.offset}`
                : ''))
            .all(sqlParameters);
    }
    if (options &&
        (options.includeComments ||
            options.includeLotsAndLotOccupancies ||
            options.includeMilestones)) {
        for (const workOrder of workOrders) {
            if (options.includeComments) {
                workOrder.workOrderComments = getWorkOrderComments(workOrder.workOrderId, database);
            }
            if (options.includeLotsAndLotOccupancies) {
                workOrder.workOrderLots = getLots({
                    workOrderId: workOrder.workOrderId
                }, {
                    limit: -1,
                    offset: 0
                }, database).lots;
                workOrder.workOrderLotOccupancies = getLotOccupancies({
                    workOrderId: workOrder.workOrderId
                }, {
                    limit: -1,
                    offset: 0,
                    includeOccupants: true
                }, database).lotOccupancies;
            }
            if (options.includeMilestones) {
                workOrder.workOrderMilestones = getWorkOrderMilestones({
                    workOrderId: workOrder.workOrderId
                }, {
                    orderBy: 'date'
                }, database);
            }
        }
    }
    if (!connectedDatabase) {
        database.close();
    }
    return {
        count,
        workOrders
    };
}
export default getWorkOrders;
