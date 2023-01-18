import { acquireConnection } from './pool.js'
import type { PoolConnection } from 'better-sqlite-pool'

import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js'

import { addOrUpdateLotOccupancyField } from './addOrUpdateLotOccupancyField.js'
import { addLotOccupancyOccupant } from './addLotOccupancyOccupant.js'

import type * as recordTypes from '../../types/recordTypes'

interface AddLotOccupancyForm {
  occupancyTypeId: string | number
  lotId: string | number

  occupancyStartDateString: string
  occupancyEndDateString: string

  occupancyTypeFieldIds?: string
  [lotOccupancyFieldValue_occupancyTypeFieldId: string]: unknown

  lotOccupantTypeId?: string
  occupantName?: string
  occupantAddress1?: string
  occupantAddress2?: string
  occupantCity?: string
  occupantProvince?: string
  occupantPostalCode?: string
  occupantPhoneNumber?: string
  occupantEmailAddress?: string
  occupantComment?: string
}

export async function addLotOccupancy(
  lotOccupancyForm: AddLotOccupancyForm,
  requestSession: recordTypes.PartialSession,
  connectedDatabase?: PoolConnection
): Promise<number> {
  const database = connectedDatabase ?? (await acquireConnection())

  const rightNowMillis = Date.now()

  const occupancyStartDate = dateTimeFunctions.dateStringToInteger(
    lotOccupancyForm.occupancyStartDateString
  )

  if (occupancyStartDate <= 0) {
    console.error(lotOccupancyForm)
  }

  /* eslint-disable @typescript-eslint/indent */
  const result = database
    .prepare(
      `insert into LotOccupancies (
        occupancyTypeId, lotId,
        occupancyStartDate, occupancyEndDate,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      lotOccupancyForm.occupancyTypeId,
      lotOccupancyForm.lotId === '' ? undefined : lotOccupancyForm.lotId,
      occupancyStartDate,
      lotOccupancyForm.occupancyEndDateString === ''
        ? undefined
        : dateTimeFunctions.dateStringToInteger(
            lotOccupancyForm.occupancyEndDateString
          ),
      requestSession.user!.userName,
      rightNowMillis,
      requestSession.user!.userName,
      rightNowMillis
    )

  const lotOccupancyId = result.lastInsertRowid as number

  const occupancyTypeFieldIds = (
    lotOccupancyForm.occupancyTypeFieldIds ?? ''
  ).split(',')

  for (const occupancyTypeFieldId of occupancyTypeFieldIds) {
    const lotOccupancyFieldValue = lotOccupancyForm[
      'lotOccupancyFieldValue_' + occupancyTypeFieldId
    ] as string

    if (lotOccupancyFieldValue && lotOccupancyFieldValue !== '') {
      await addOrUpdateLotOccupancyField(
        {
          lotOccupancyId,
          occupancyTypeFieldId,
          lotOccupancyFieldValue
        },
        requestSession,
        database
      )
    }
  }

  if (lotOccupancyForm.lotOccupantTypeId) {
    await addLotOccupancyOccupant(
      {
        lotOccupancyId,
        lotOccupantTypeId: lotOccupancyForm.lotOccupantTypeId,
        occupantName: lotOccupancyForm.occupantName!,
        occupantAddress1: lotOccupancyForm.occupantAddress1!,
        occupantAddress2: lotOccupancyForm.occupantAddress2!,
        occupantCity: lotOccupancyForm.occupantCity!,
        occupantProvince: lotOccupancyForm.occupantProvince!,
        occupantPostalCode: lotOccupancyForm.occupantPostalCode!,
        occupantPhoneNumber: lotOccupancyForm.occupantPhoneNumber!,
        occupantEmailAddress: lotOccupancyForm.occupantEmailAddress!,
        occupantComment: lotOccupancyForm.occupantComment!
      },
      requestSession,
      database
    )
  }

  if (connectedDatabase === undefined) {
    database.release()
  }

  return lotOccupancyId
}

export default addLotOccupancy
