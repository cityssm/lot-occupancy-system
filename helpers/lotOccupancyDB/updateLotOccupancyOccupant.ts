import { acquireConnection } from './pool.js'

import type * as recordTypes from '../../types/recordTypes'

interface UpdateLotOccupancyOccupantForm {
  lotOccupancyId: string | number
  lotOccupantIndex: string | number
  lotOccupantTypeId: string | number
  occupantName: string
  occupantFamilyName: string
  occupantAddress1: string
  occupantAddress2: string
  occupantCity: string
  occupantProvince: string
  occupantPostalCode: string
  occupantPhoneNumber: string
  occupantEmailAddress: string
  occupantComment: string
}

export async function updateLotOccupancyOccupant(
  lotOccupancyOccupantForm: UpdateLotOccupancyOccupantForm,
  requestSession: recordTypes.PartialSession
): Promise<boolean> {
  const database = await acquireConnection()

  const rightNowMillis = Date.now()

  const results = database
    .prepare(
      `update LotOccupancyOccupants
        set occupantName = ?,
        occupantFamilyName = ?,
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
      lotOccupancyOccupantForm.occupantFamilyName,
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

  database.release()

  return results.changes > 0
}

export default updateLotOccupancyOccupant
