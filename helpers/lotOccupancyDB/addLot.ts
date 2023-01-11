import sqlite from 'better-sqlite3'

import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js'

import { addOrUpdateLotField } from './addOrUpdateLotField.js'

import type * as recordTypes from '../../types/recordTypes'

interface AddLotForm {
  lotName: string
  lotTypeId: string | number
  lotStatusId: string | number

  mapId: string | number
  mapKey: string

  lotLatitude: string
  lotLongitude: string

  lotTypeFieldIds?: string
  [lotFieldValue_lotTypeFieldId: string]: unknown
}

export function addLot(
  lotForm: AddLotForm,
  requestSession: recordTypes.PartialSession
): number {
  const database = sqlite(databasePath)

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `insert into Lots (
                lotName, lotTypeId, lotStatusId,
                mapId, mapKey,
                lotLatitude, lotLongitude,
                recordCreate_userName, recordCreate_timeMillis,
                recordUpdate_userName, recordUpdate_timeMillis) 
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      lotForm.lotName,
      lotForm.lotTypeId,
      lotForm.lotStatusId === '' ? undefined : lotForm.lotStatusId,
      lotForm.mapId === '' ? undefined : lotForm.mapId,
      lotForm.mapKey,
      lotForm.lotLatitude === '' ? undefined : lotForm.lotLatitude,
      lotForm.lotLongitude === '' ? undefined : lotForm.lotLongitude,
      requestSession.user!.userName,
      rightNowMillis,
      requestSession.user!.userName,
      rightNowMillis
    )

  const lotId = result.lastInsertRowid as number

  const lotTypeFieldIds = (lotForm.lotTypeFieldIds ?? '').split(',')

  for (const lotTypeFieldId of lotTypeFieldIds) {
    const lotFieldValue = lotForm['lotFieldValue_' + lotTypeFieldId] as string

    if (lotFieldValue && lotFieldValue !== '') {
      addOrUpdateLotField(
        {
          lotId,
          lotTypeFieldId,
          lotFieldValue
        },
        requestSession,
        database
      )
    }
  }

  database.close()

  return lotId
}

export default addLot
