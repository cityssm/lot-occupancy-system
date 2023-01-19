import { acquireConnection } from './pool.js'
import type { PoolConnection } from 'better-sqlite-pool'

import type * as recordTypes from '../../types/recordTypes'

interface AddLotOccupancyOccupantForm {
  lotOccupancyId: string | number
  lotOccupantTypeId: string | number
  occupantName: string
  occupantAddress1: string
  occupantAddress2: string
  occupantCity: string
  occupantProvince: string
  occupantPostalCode: string
  occupantPhoneNumber: string
  occupantEmailAddress: string
  occupantComment?: string
}

export async function addLotOccupancyOccupant(
  lotOccupancyOccupantForm: AddLotOccupancyOccupantForm,
  requestSession: recordTypes.PartialSession,
  connectedDatabase?: PoolConnection
): Promise<number> {
  const database = connectedDatabase ?? (await acquireConnection())

  let lotOccupantIndex = 0

  const maxIndexResult: { lotOccupantIndex: number } | undefined = database
    .prepare(
      `select lotOccupantIndex
        from LotOccupancyOccupants
        where lotOccupancyId = ?
        order by lotOccupantIndex desc
        limit 1`
    )
    .get(lotOccupancyOccupantForm.lotOccupancyId)

  if (maxIndexResult !== undefined) {
    lotOccupantIndex = maxIndexResult.lotOccupantIndex + 1
  }

  const rightNowMillis = Date.now()

  database
    .prepare(
      `insert into LotOccupancyOccupants (
        lotOccupancyId, lotOccupantIndex,
        occupantName,
        occupantAddress1, occupantAddress2,
        occupantCity, occupantProvince, occupantPostalCode,
        occupantPhoneNumber, occupantEmailAddress,
        occupantComment,
        lotOccupantTypeId,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      lotOccupancyOccupantForm.lotOccupancyId,
      lotOccupantIndex,
      lotOccupancyOccupantForm.occupantName,
      lotOccupancyOccupantForm.occupantAddress1,
      lotOccupancyOccupantForm.occupantAddress2,
      lotOccupancyOccupantForm.occupantCity,
      lotOccupancyOccupantForm.occupantProvince,
      lotOccupancyOccupantForm.occupantPostalCode,
      lotOccupancyOccupantForm.occupantPhoneNumber,
      lotOccupancyOccupantForm.occupantEmailAddress,
      lotOccupancyOccupantForm.occupantComment ?? '',
      lotOccupancyOccupantForm.lotOccupantTypeId,
      requestSession.user!.userName,
      rightNowMillis,
      requestSession.user!.userName,
      rightNowMillis
    )

  if (connectedDatabase === undefined) {
    database.release()
  }

  return lotOccupantIndex
}

export default addLotOccupancyOccupant
