import { dateToString } from '@cityssm/utils-datetime'

import type { LotOccupancy } from '../types/recordTypes.js'

import addLotOccupancy from './addLotOccupancy.js'
import addLotOccupancyComment from './addLotOccupancyComment.js'
import addLotOccupancyOccupant from './addLotOccupancyOccupant.js'
import getLotOccupancy from './getLotOccupancy.js'
import { acquireConnection } from './pool.js'

export default async function copyLotOccupancy(
  oldLotOccupancyId: number | string,
  user: User
): Promise<number> {
  const database = await acquireConnection()

  const oldLotOccupancy = await getLotOccupancy(oldLotOccupancyId, database) as LotOccupancy

  const newLotOccupancyId = await addLotOccupancy(
    {
      lotId: oldLotOccupancy.lotId ?? '',
      occupancyTypeId: oldLotOccupancy.occupancyTypeId,
      occupancyStartDateString: dateToString(new Date()),
      occupancyEndDateString: ''
    },
    user,
    database
  )

  /*
   * Copy Fields
   */

  const rightNowMillis = Date.now()

  for (const occupancyField of oldLotOccupancy.lotOccupancyFields ?? []) {
    database
      .prepare(
        `insert into LotOccupancyFields (
          lotOccupancyId, occupancyTypeFieldId, lotOccupancyFieldValue,
          recordCreate_userName, recordCreate_timeMillis,
          recordUpdate_userName, recordUpdate_timeMillis)
          values (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        newLotOccupancyId,
        occupancyField.occupancyTypeFieldId,
        occupancyField.lotOccupancyFieldValue,
        user.userName,
        rightNowMillis,
        user.userName,
        rightNowMillis
      )
  }

  /*
   * Copy Occupants
   */

  for (const occupant of oldLotOccupancy.lotOccupancyOccupants ?? []) {
    await addLotOccupancyOccupant(
      {
        lotOccupancyId: newLotOccupancyId,
        lotOccupantTypeId: occupant.lotOccupantTypeId!,
        occupantName: occupant.occupantName!,
        occupantFamilyName: occupant.occupantFamilyName!,
        occupantAddress1: occupant.occupantAddress1!,
        occupantAddress2: occupant.occupantAddress2!,
        occupantCity: occupant.occupantCity!,
        occupantProvince: occupant.occupantProvince!,
        occupantPostalCode: occupant.occupantPostalCode!,
        occupantPhoneNumber: occupant.occupantPhoneNumber!,
        occupantEmailAddress: occupant.occupantEmailAddress!
      },
      user,
      database
    )
  }

  /*
   * Add Comment
   */

  await addLotOccupancyComment({
    lotOccupancyId: newLotOccupancyId,
    lotOccupancyComment: `New record copied from #${oldLotOccupancyId}.`
  }, user)

  database.release()

  return newLotOccupancyId
}
