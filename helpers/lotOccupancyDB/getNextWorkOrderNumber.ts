import { acquireConnection } from './pool.js'
import type { PoolConnection } from 'better-sqlite-pool'

import * as configFunctions from '../functions.config.js'

export async function getNextWorkOrderNumber(
  connectedDatabase?: PoolConnection
): Promise<string> {
  const database = connectedDatabase ?? (await acquireConnection())

  const paddingLength = configFunctions.getProperty(
    'settings.workOrders.workOrderNumberLength'
  )
  const currentYearString = new Date().getFullYear().toString()

  const regex = new RegExp('^' + currentYearString + '-\\d+$')

  database.function(
    'userFn_matchesWorkOrderNumberSyntax',
    (workOrderNumber: string) => {
      return regex.test(workOrderNumber) ? 1 : 0
    }
  )

  const workOrderNumberRecord = database
    .prepare(
      'select workOrderNumber from WorkOrders' +
        ' where userFn_matchesWorkOrderNumberSyntax(workOrderNumber) = 1' +
        " order by cast(substr(workOrderNumber, instr(workOrderNumber, '-') + 1) as integer) desc"
    )
    .get()

  if (connectedDatabase === undefined) {
    database.release()
  }

  let workOrderNumberIndex = 0

  if (workOrderNumberRecord) {
    workOrderNumberIndex = Number.parseInt(
      workOrderNumberRecord.workOrderNumber.split('-')[1],
      10
    )
  }

  workOrderNumberIndex += 1

  return (
    currentYearString +
    '-' +
    workOrderNumberIndex.toString().padStart(paddingLength, '0')
  )
}

export default getNextWorkOrderNumber
