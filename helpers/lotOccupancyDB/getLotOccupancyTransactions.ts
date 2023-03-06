import { acquireConnection } from './pool.js'
import type { PoolConnection } from 'better-sqlite-pool'

import {
  dateIntegerToString,
  timeIntegerToString
} from '@cityssm/expressjs-server-js/dateTimeFns.js'

import * as configFunctions from '../functions.config.js'
import * as gpFunctions from '../functions.dynamicsGP.js'

import type * as recordTypes from '../../types/recordTypes'

export async function getLotOccupancyTransactions(
  lotOccupancyId: number | string,
  connectedDatabase?: PoolConnection
): Promise<recordTypes.LotOccupancyTransaction[]> {
  const database = connectedDatabase ?? (await acquireConnection())

  database.function('userFn_dateIntegerToString', dateIntegerToString)
  database.function('userFn_timeIntegerToString', timeIntegerToString)

  const lotOccupancyTransactions: recordTypes.LotOccupancyTransaction[] =
    database
      .prepare(
        `select lotOccupancyId, transactionIndex,
          transactionDate, userFn_dateIntegerToString(transactionDate) as transactionDateString,
          transactionTime, userFn_timeIntegerToString(transactionTime) as transactionTimeString,
          transactionAmount, externalReceiptNumber, transactionNote
          from LotOccupancyTransactions
          where recordDelete_timeMillis is null
          and lotOccupancyId = ?
          order by transactionDate, transactionTime, transactionIndex`
      )
      .all(lotOccupancyId)

  if (connectedDatabase === undefined) {
    database.release()
  }

  if (configFunctions.getProperty('settings.dynamicsGP.integrationIsEnabled')) {
    for (const transaction of lotOccupancyTransactions) {
      if ((transaction.externalReceiptNumber ?? '') !== '') {
        const gpDocument = await gpFunctions.getDynamicsGPDocument(
          transaction.externalReceiptNumber!
        )

        if (gpDocument !== undefined) {
          transaction.dynamicsGPDocument = gpDocument
        }
      }
    }
  }

  return lotOccupancyTransactions
}

export default getLotOccupancyTransactions
