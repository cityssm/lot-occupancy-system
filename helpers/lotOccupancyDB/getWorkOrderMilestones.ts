import sqlite from 'better-sqlite3'

import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js'

import {
  dateIntegerToString,
  dateStringToInteger,
  dateToInteger,
  timeIntegerToString
} from '@cityssm/expressjs-server-js/dateTimeFns.js'

import * as configFunctions from '../functions.config.js'

import { getLots } from './getLots.js'
import { getLotOccupancies } from './getLotOccupancies.js'

import type * as recordTypes from '../../types/recordTypes'

export interface WorkOrderMilestoneFilters {
  workOrderId?: number | string
  workOrderMilestoneDateFilter?: 'upcomingMissed' | 'recent' | 'date'
  workOrderMilestoneDateString?: string
  workOrderTypeIds?: string
  workOrderMilestoneTypeIds?: string
}

interface WorkOrderMilestoneOptions {
  includeWorkOrders?: boolean
  orderBy: 'completion' | 'date'
}

const commaSeparatedNumbersRegex = /^\d+(,\d+)*$/

function buildWhereClause(filters: WorkOrderMilestoneFilters): {
  sqlWhereClause: string
  sqlParameters: unknown[]
} {
  let sqlWhereClause =
    ' where m.recordDelete_timeMillis is null and w.recordDelete_timeMillis is null'
  const sqlParameters: unknown[] = []

  if (filters.workOrderId) {
    sqlWhereClause += ' and m.workOrderId = ?'
    sqlParameters.push(filters.workOrderId)
  }

  const date = new Date()
  const currentDateNumber = dateToInteger(date)

  date.setDate(
    date.getDate() -
      configFunctions.getProperty(
        'settings.workOrders.workOrderMilestoneDateRecentBeforeDays'
      )
  )

  const recentBeforeDateNumber = dateToInteger(date)

  date.setDate(
    date.getDate() +
      configFunctions.getProperty(
        'settings.workOrders.workOrderMilestoneDateRecentBeforeDays'
      ) +
      configFunctions.getProperty(
        'settings.workOrders.workOrderMilestoneDateRecentAfterDays'
      )
  )

  const recentAfterDateNumber = dateToInteger(date)

  switch (filters.workOrderMilestoneDateFilter) {
    case 'upcomingMissed': {
      sqlWhereClause +=
        ' and (m.workOrderMilestoneCompletionDate is null or m.workOrderMilestoneDate >= ?)'
      sqlParameters.push(currentDateNumber)
      break
    }

    case 'recent': {
      sqlWhereClause +=
        ' and m.workOrderMilestoneDate >= ? and m.workOrderMilestoneDate <= ?'
      sqlParameters.push(recentBeforeDateNumber, recentAfterDateNumber)
      break
    }
  }

  if (filters.workOrderMilestoneDateString) {
    sqlWhereClause += ' and m.workOrderMilestoneDate = ?'
    sqlParameters.push(
      dateStringToInteger(filters.workOrderMilestoneDateString)
    )
  }

  if (
    filters.workOrderTypeIds &&
    commaSeparatedNumbersRegex.test(filters.workOrderTypeIds)
  ) {
    sqlWhereClause +=
      ' and w.workOrderTypeId in (' + filters.workOrderTypeIds + ')'
  }

  if (
    filters.workOrderMilestoneTypeIds &&
    commaSeparatedNumbersRegex.test(filters.workOrderMilestoneTypeIds)
  ) {
    sqlWhereClause +=
      ' and m.workOrderMilestoneTypeId in (' +
      filters.workOrderMilestoneTypeIds +
      ')'
  }

  return {
    sqlWhereClause,
    sqlParameters
  }
}

export function getWorkOrderMilestones(
  filters: WorkOrderMilestoneFilters,
  options: WorkOrderMilestoneOptions,
  connectedDatabase?: sqlite.Database
): recordTypes.WorkOrderMilestone[] {
  const database =
    connectedDatabase ??
    sqlite(databasePath, {
      readonly: true
    })

  database.function('userFn_dateIntegerToString', dateIntegerToString)
  database.function('userFn_timeIntegerToString', timeIntegerToString)

  // Filters
  const { sqlWhereClause, sqlParameters } = buildWhereClause(filters)

  // Order By
  let orderByClause = ''

  switch (options.orderBy) {
    case 'completion': {
      orderByClause =
        ' order by' +
        ' m.workOrderMilestoneCompletionDate, m.workOrderMilestoneCompletionTime,' +
        ' m.workOrderMilestoneDate, case when m.workOrderMilestoneTime = 0 then 9999 else m.workOrderMilestoneTime end,' +
        ' t.orderNumber, m.workOrderMilestoneId'
      break
    }

    case 'date': {
      orderByClause =
        ' order by m.workOrderMilestoneDate, case when m.workOrderMilestoneTime = 0 then 9999 else m.workOrderMilestoneTime end,' +
        ' t.orderNumber, m.workOrderId, m.workOrderMilestoneId'
      break
    }
  }

  // Query
  const sql =
    'select m.workOrderMilestoneId,' +
    ' m.workOrderMilestoneTypeId, t.workOrderMilestoneType,' +
    ' m.workOrderMilestoneDate, userFn_dateIntegerToString(m.workOrderMilestoneDate) as workOrderMilestoneDateString,' +
    ' m.workOrderMilestoneTime, userFn_timeIntegerToString(m.workOrderMilestoneTime) as workOrderMilestoneTimeString,' +
    ' m.workOrderMilestoneDescription,' +
    ' m.workOrderMilestoneCompletionDate, userFn_dateIntegerToString(m.workOrderMilestoneCompletionDate) as workOrderMilestoneCompletionDateString,' +
    ' m.workOrderMilestoneCompletionTime, userFn_timeIntegerToString(m.workOrderMilestoneCompletionTime) as workOrderMilestoneCompletionTimeString,' +
    (options.includeWorkOrders
      ? ' m.workOrderId, w.workOrderNumber, wt.workOrderType, w.workOrderDescription,' +
        ' w.workOrderOpenDate, userFn_dateIntegerToString(w.workOrderOpenDate) as workOrderOpenDateString,' +
        ' w.workOrderCloseDate, userFn_dateIntegerToString(w.workOrderCloseDate) as workOrderCloseDateString,' +
        ' w.recordUpdate_timeMillis as workOrderRecordUpdate_timeMillis,'
      : '') +
    ' m.recordCreate_userName, m.recordCreate_timeMillis,' +
    ' m.recordUpdate_userName, m.recordUpdate_timeMillis' +
    ' from WorkOrderMilestones m' +
    ' left join WorkOrderMilestoneTypes t on m.workOrderMilestoneTypeId = t.workOrderMilestoneTypeId' +
    ' left join WorkOrders w on m.workOrderId = w.workOrderId' +
    ' left join WorkOrderTypes wt on w.workOrderTypeId = wt.workOrderTypeId' +
    sqlWhereClause +
    orderByClause

  const workOrderMilestones: recordTypes.WorkOrderMilestone[] = database
    .prepare(sql)
    .all(sqlParameters)

  if (options.includeWorkOrders) {
    for (const workOrderMilestone of workOrderMilestones) {
      workOrderMilestone.workOrderLots = getLots(
        {
          workOrderId: workOrderMilestone.workOrderId
        },
        {
          limit: -1,
          offset: 0
        },
        database
      ).lots

      workOrderMilestone.workOrderLotOccupancies = getLotOccupancies(
        {
          workOrderId: workOrderMilestone.workOrderId
        },
        {
          limit: -1,
          offset: 0,
          includeOccupants: true
        },
        database
      ).lotOccupancies
    }
  }

  if (!connectedDatabase) {
    database.close()
  }

  return workOrderMilestones
}

export default getWorkOrderMilestones
