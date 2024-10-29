import type { PoolConnection } from 'better-sqlite-pool'

import { getConfigProperty } from '../helpers/functions.config.js'

import { acquireConnection } from './pool.js'

export default async function getNextWorkOrderNumber(
  connectedDatabase?: PoolConnection
): Promise<string> {
  const database = connectedDatabase ?? (await acquireConnection())

  const paddingLength = getConfigProperty(
    'settings.workOrders.workOrderNumberLength'
  )
  const currentYearString = new Date().getFullYear().toString()

  const regex = new RegExp(`^${currentYearString}-\\d+$`)

  database.function(
    // eslint-disable-next-line no-secrets/no-secrets
    'userFn_matchesWorkOrderNumberSyntax',
    (workOrderNumber: string) => (regex.test(workOrderNumber) ? 1 : 0)
  )

  const workOrderNumberRecord = database
    .prepare(
      // eslint-disable-next-line no-secrets/no-secrets
      `select workOrderNumber from WorkOrders
        where userFn_matchesWorkOrderNumberSyntax(workOrderNumber) = 1
        order by cast(substr(workOrderNumber, instr(workOrderNumber, '-') + 1) as integer) desc`
    )
    .get() as
    | {
        workOrderNumber: string
      }
    | undefined

  if (connectedDatabase === undefined) {
    database.release()
  }

  let workOrderNumberIndex = 0

  if (workOrderNumberRecord !== undefined) {
    workOrderNumberIndex = Number.parseInt(
      workOrderNumberRecord.workOrderNumber.split('-')[1],
      10
    )
  }

  workOrderNumberIndex += 1

  return `${currentYearString}-${workOrderNumberIndex.toString().padStart(paddingLength, '0')}`
}
