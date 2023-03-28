/* eslint-disable @typescript-eslint/indent */
import { acquireConnection } from './pool.js'

import { addOrUpdateLotField } from './addOrUpdateLotField.js'
import { deleteLotField } from './deleteLotField.js'

import type * as recordTypes from '../../types/recordTypes'

interface UpdateLotForm {
  lotId: string | number
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

export async function updateLot(
  lotForm: UpdateLotForm,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `update Lots
        set lotName = ?,
        lotTypeId = ?,
        lotStatusId = ?,
        mapId = ?,
        mapKey = ?,
        lotLatitude = ?,
        lotLongitude = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where lotId = ?
        and recordDelete_timeMillis is null`
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
      Date.now(),
      lotForm.lotId
    )

  if (result.changes > 0) {
    const lotTypeFieldIds = (lotForm.lotTypeFieldIds ?? '').split(',')

    for (const lotTypeFieldId of lotTypeFieldIds) {
      const lotFieldValue = lotForm['lotFieldValue_' + lotTypeFieldId] as
        | string
        | undefined

      await ((lotFieldValue ?? '') === ''
        ? deleteLotField(
            lotForm.lotId,
            lotTypeFieldId,
            requestSession,
            database
          )
        : addOrUpdateLotField(
            {
              lotId: lotForm.lotId,
              lotTypeFieldId,
              lotFieldValue: lotFieldValue!
            },
            requestSession,
            database
          ))
    }
  }

  database.release()

  return result.changes > 0
}

export async function updateLotStatus(
  lotId: number | string,
  lotStatusId: number | string,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const database = await acquireConnection()

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `update Lots
        set lotStatusId = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where lotId = ?
        and recordDelete_timeMillis is null`
    )
    .run(
      lotStatusId === '' ? undefined : lotStatusId,
      requestSession.user!.userName,
      rightNowMillis,
      lotId
    )

  database.release()

  return result.changes > 0
}

export default updateLot
