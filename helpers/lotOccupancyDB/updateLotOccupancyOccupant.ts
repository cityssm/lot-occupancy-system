import sqlite from 'better-sqlite3'

import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js'

import type * as recordTypes from '../../types/recordTypes'

interface UpdateLotOccupancyOccupantForm {
  lotOccupancyId: string | number
  lotOccupantIndex: string | number
  lotOccupantTypeId: string | number
  occupantName: string
  occupantAddress1: string
  occupantAddress2: string
  occupantCity: string
  occupantProvince: string
  occupantPostalCode: string
  occupantPhoneNumber: string
  occupantEmailAddress: string
  occupantComment: string
}

export function updateLotOccupancyOccupant(
  lotOccupancyOccupantForm: UpdateLotOccupancyOccupantForm,
  requestSession: recordTypes.PartialSession
): boolean {
  const database = sqlite(databasePath)

  const rightNowMillis = Date.now()

  const results = database
    .prepare(
      `update LotOccupancyOccupants
                set occupantName = ?,
                occupantAddress1 = ?,
                occupantAddress2 = ?,
                occupantCity = ?,
                occupantProvince = ?,
                occupantPostalCode = ?,
                occupantPhoneNumber = ?,
                occupantEmailAddress = ?,
                occupantComment = ?,
                lotOccupantTypeId = ?,
                recordUpdate_userName = ?,
                recordUpdate_timeMillis = ?
                where recordDelete_timeMillis is null
                and lotOccupancyId = ?
                and lotOccupantIndex = ?`
    )
    .run(
      lotOccupancyOccupantForm.occupantName,
      lotOccupancyOccupantForm.occupantAddress1,
      lotOccupancyOccupantForm.occupantAddress2,
      lotOccupancyOccupantForm.occupantCity,
      lotOccupancyOccupantForm.occupantProvince,
      lotOccupancyOccupantForm.occupantPostalCode,
      lotOccupancyOccupantForm.occupantPhoneNumber,
      lotOccupancyOccupantForm.occupantEmailAddress,
      lotOccupancyOccupantForm.occupantComment,
      lotOccupancyOccupantForm.lotOccupantTypeId,
      requestSession.user!.userName,
      rightNowMillis,
      lotOccupancyOccupantForm.lotOccupancyId,
      lotOccupancyOccupantForm.lotOccupantIndex
    )

  database.close()

  return results.changes > 0
}

export default updateLotOccupancyOccupant
