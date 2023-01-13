import sqlite from 'better-sqlite3'
import { lotOccupancyDB as databasePath } from '../data/databasePaths.js'

import * as cacheFunctions from '../helpers/functions.cache.js'

/*
 * Fee IDs
 */

const feeCache: Map<string, number> = new Map()

export function getFeeIdByFeeDescription(feeDescription: string): number {
  if (feeCache.keys.length === 0) {
    const database = sqlite(databasePath, {
      readonly: true
    })

    const records: Array<{
      feeId: number
      feeDescription: string
    }> = database
      .prepare(
        "select feeId, feeDescription from Fees where feeDescription like 'CMPP_FEE_%'"
      )
      .all()

    for (const record of records) {
      feeCache.set(record.feeDescription, record.feeId)
    }

    database.close()
  }

  return feeCache.get(feeDescription)!
}

/*
 * Lot Occupant Type IDs
 */

export const preneedOwnerLotOccupantTypeId =
  cacheFunctions.getLotOccupantTypeByLotOccupantType(
    'Preneed Owner'
  )!.lotOccupantTypeId

export const funeralDirectorLotOccupantTypeId =
  cacheFunctions.getLotOccupantTypeByLotOccupantType(
    'Funeral Director'
  )!.lotOccupantTypeId

export const deceasedLotOccupantTypeId =
  cacheFunctions.getLotOccupantTypeByLotOccupantType(
    'Deceased'
  )!.lotOccupantTypeId

export const purchaserLotOccupantTypeId =
  cacheFunctions.getLotOccupantTypeByLotOccupantType(
    'Purchaser'
  )!.lotOccupantTypeId

/*
 * Lot Status IDs
 */

export const availableLotStatusId =
  cacheFunctions.getLotStatusByLotStatus('Available')!.lotStatusId
export const reservedLotStatusId =
  cacheFunctions.getLotStatusByLotStatus('Reserved')!.lotStatusId
export const takenLotStatusId =
  cacheFunctions.getLotStatusByLotStatus('Taken')!.lotStatusId

/*
 * Lot Type IDs
 */

const casketLotTypeId =
  cacheFunctions.getLotTypesByLotType('Casket Grave')!.lotTypeId
const columbariumLotTypeId =
  cacheFunctions.getLotTypesByLotType('Columbarium')!.lotTypeId
const crematoriumLotTypeId =
  cacheFunctions.getLotTypesByLotType('Crematorium')!.lotTypeId
const mausoleumLotTypeId =
  cacheFunctions.getLotTypesByLotType('Mausoleum')!.lotTypeId
const nicheWallLotTypeId =
  cacheFunctions.getLotTypesByLotType('Niche Wall')!.lotTypeId
const urnGardenLotTypeId =
  cacheFunctions.getLotTypesByLotType('Urn Garden')!.lotTypeId

export function getLotTypeId(dataRow: { cemetery: string }): number {
  switch (dataRow.cemetery) {
    case '00': {
      return crematoriumLotTypeId
    }
    case 'GC':
    case 'HC': {
      return columbariumLotTypeId
    }
    case 'MA': {
      return mausoleumLotTypeId
    }
    case 'MN':
    case 'NW': {
      return nicheWallLotTypeId
    }
    case 'UG': {
      return urnGardenLotTypeId
    }
  }

  return casketLotTypeId
}

/*
 * Occupancy Type IDs
 */

export const preneedOccupancyType =
  cacheFunctions.getOccupancyTypeByOccupancyType('Preneed')!

export const deceasedOccupancyType =
  cacheFunctions.getOccupancyTypeByOccupancyType('Interment')!

export const cremationOccupancyType =
  cacheFunctions.getOccupancyTypeByOccupancyType('Cremation')!

/*
 * Work Order Milestone Type IDs
 */

export const acknowledgedWorkOrderMilestoneTypeId =
  cacheFunctions.getWorkOrderMilestoneTypeByWorkOrderMilestoneType(
    'Acknowledged'
  )?.workOrderMilestoneTypeId

export const deathWorkOrderMilestoneTypeId =
  cacheFunctions.getWorkOrderMilestoneTypeByWorkOrderMilestoneType(
    'Death'
  )?.workOrderMilestoneTypeId

export const funeralWorkOrderMilestoneTypeId =
  cacheFunctions.getWorkOrderMilestoneTypeByWorkOrderMilestoneType(
    'Funeral'
  )?.workOrderMilestoneTypeId

export const cremationWorkOrderMilestoneTypeId =
  cacheFunctions.getWorkOrderMilestoneTypeByWorkOrderMilestoneType(
    'Cremation'
  )?.workOrderMilestoneTypeId

export const intermentWorkOrderMilestoneTypeId =
  cacheFunctions.getWorkOrderMilestoneTypeByWorkOrderMilestoneType(
    'Interment'
  )?.workOrderMilestoneTypeId

/*
 * Work Order Type IDs
 */

export const workOrderTypeId = 1
