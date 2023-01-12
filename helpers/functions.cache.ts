import * as configFunctions from './functions.config.js'

import { getLotOccupantTypes as getLotOccupantTypesFromDatabase } from './lotOccupancyDB/getLotOccupantTypes.js'

import { getLotStatuses as getLotStatusesFromDatabase } from './lotOccupancyDB/getLotStatuses.js'

import { getLotTypes as getLotTypesFromDatabase } from './lotOccupancyDB/getLotTypes.js'

import { getOccupancyTypes as getOccupancyTypesFromDatabase } from './lotOccupancyDB/getOccupancyTypes.js'
import { getOccupancyTypeFields as getOccupancyTypeFieldsFromDatabase } from './lotOccupancyDB/getOccupancyTypeFields.js'

import { getWorkOrderTypes as getWorkOrderTypesFromDatabase } from './lotOccupancyDB/getWorkOrderTypes.js'

import { getWorkOrderMilestoneTypes as getWorkOrderMilestoneTypesFromDatabase } from './lotOccupancyDB/getWorkOrderMilestoneTypes.js'

import type * as recordTypes from '../types/recordTypes'

/*
 * Lot Occupant Types
 */

let lotOccupantTypes: recordTypes.LotOccupantType[] | undefined

export function getLotOccupantTypes(): recordTypes.LotOccupantType[] {
  if (lotOccupantTypes === undefined) {
    lotOccupantTypes = getLotOccupantTypesFromDatabase()
  }

  return lotOccupantTypes
}

export function getLotOccupantTypeById(
  lotOccupantTypeId: number
): recordTypes.LotOccupantType | undefined {
  const cachedLotOccupantTypes = getLotOccupantTypes()

  return cachedLotOccupantTypes.find((currentLotOccupantType) => {
    return currentLotOccupantType.lotOccupantTypeId === lotOccupantTypeId
  })
}

export function getLotOccupantTypeByLotOccupantType(
  lotOccupantType: string
): recordTypes.LotOccupantType | undefined {
  const cachedLotOccupantTypes = getLotOccupantTypes()

  const lotOccupantTypeLowerCase = lotOccupantType.toLowerCase()

  return cachedLotOccupantTypes.find((currentLotOccupantType) => {
    return (
      currentLotOccupantType.lotOccupantType.toLowerCase() ===
      lotOccupantTypeLowerCase
    )
  })
}

function clearLotOccupantTypesCache(): void {
  lotOccupantTypes = undefined
}

/*
 * Lot Statuses
 */

let lotStatuses: recordTypes.LotStatus[] | undefined

export function getLotStatuses(): recordTypes.LotStatus[] {
  if (lotStatuses === undefined) {
    lotStatuses = getLotStatusesFromDatabase()
  }

  return lotStatuses
}

export function getLotStatusById(
  lotStatusId: number
): recordTypes.LotStatus | undefined {
  const cachedLotStatuses = getLotStatuses()

  return cachedLotStatuses.find((currentLotStatus) => {
    return currentLotStatus.lotStatusId === lotStatusId
  })
}

export function getLotStatusByLotStatus(
  lotStatus: string
): recordTypes.LotStatus | undefined {
  const cachedLotStatuses = getLotStatuses()

  const lotStatusLowerCase = lotStatus.toLowerCase()

  return cachedLotStatuses.find((currentLotStatus) => {
    return currentLotStatus.lotStatus.toLowerCase() === lotStatusLowerCase
  })
}

function clearLotStatusesCache(): void {
  lotStatuses = undefined
}

/*
 * Lot Types
 */

let lotTypes: recordTypes.LotType[] | undefined

export function getLotTypes(): recordTypes.LotType[] {
  if (lotTypes === undefined) {
    lotTypes = getLotTypesFromDatabase()
  }

  return lotTypes
}

export function getLotTypeById(
  lotTypeId: number
): recordTypes.LotType | undefined {
  const cachedLotTypes = getLotTypes()

  return cachedLotTypes.find((currentLotType) => {
    return currentLotType.lotTypeId === lotTypeId
  })
}

export function getLotTypesByLotType(
  lotType: string
): recordTypes.LotType | undefined {
  const cachedLotTypes = getLotTypes()

  const lotTypeLowerCase = lotType.toLowerCase()

  return cachedLotTypes.find((currentLotType) => {
    return currentLotType.lotType.toLowerCase() === lotTypeLowerCase
  })
}

function clearLotTypesCache(): void {
  lotTypes = undefined
}

/*
 * Occupancy Types
 */

let occupancyTypes: recordTypes.OccupancyType[] | undefined
let allOccupancyTypeFields: recordTypes.OccupancyTypeField[] | undefined

export function getOccupancyTypes(): recordTypes.OccupancyType[] {
  if (occupancyTypes === undefined) {
    occupancyTypes = getOccupancyTypesFromDatabase()
  }

  return occupancyTypes
}

export function getAllOccupancyTypeFields(): recordTypes.OccupancyTypeField[] {
  if (allOccupancyTypeFields === undefined) {
    allOccupancyTypeFields = getOccupancyTypeFieldsFromDatabase()
  }
  return allOccupancyTypeFields
}

export function getOccupancyTypeById(
  occupancyTypeId: number
): recordTypes.OccupancyType | undefined {
  const cachedOccupancyTypes = getOccupancyTypes()

  return cachedOccupancyTypes.find((currentOccupancyType) => {
    return currentOccupancyType.occupancyTypeId === occupancyTypeId
  })
}

export function getOccupancyTypeByOccupancyType(
  occupancyTypeString: string
): recordTypes.OccupancyType | undefined {
  const cachedOccupancyTypes = getOccupancyTypes()

  const occupancyTypeLowerCase = occupancyTypeString.toLowerCase()

  return cachedOccupancyTypes.find((currentOccupancyType) => {
    return (
      currentOccupancyType.occupancyType.toLowerCase() ===
      occupancyTypeLowerCase
    )
  })
}

export function getOccupancyTypePrintsById(occupancyTypeId: number): string[] {
  const occupancyType = getOccupancyTypeById(occupancyTypeId)

  if (
    occupancyType === undefined ||
    (occupancyType.occupancyTypePrints ?? []).length === 0
  ) {
    return []
  }

  if (occupancyType.occupancyTypePrints!.includes('*')) {
    return configFunctions.getProperty('settings.lotOccupancy.prints')
  }

  return occupancyType.occupancyTypePrints!
}

function clearOccupancyTypesCache(): void {
  occupancyTypes = undefined
  allOccupancyTypeFields = undefined
}

/*
 * Work Order Types
 */

let workOrderTypes: recordTypes.WorkOrderType[] | undefined

export function getWorkOrderTypes(): recordTypes.WorkOrderType[] {
  if (workOrderTypes === undefined) {
    workOrderTypes = getWorkOrderTypesFromDatabase()
  }

  return workOrderTypes
}

export function getWorkOrderTypeById(
  workOrderTypeId: number
): recordTypes.WorkOrderType | undefined {
  const cachedWorkOrderTypes = getWorkOrderTypes()

  return cachedWorkOrderTypes.find((currentWorkOrderType) => {
    return currentWorkOrderType.workOrderTypeId === workOrderTypeId
  })
}

function clearWorkOrderTypesCache(): void {
  workOrderTypes = undefined
}

/*
 * Work Order Milestone Types
 */

let workOrderMilestoneTypes: recordTypes.WorkOrderMilestoneType[] | undefined

export function getWorkOrderMilestoneTypes(): recordTypes.WorkOrderMilestoneType[] {
  if (workOrderMilestoneTypes === undefined) {
    workOrderMilestoneTypes = getWorkOrderMilestoneTypesFromDatabase()
  }

  return workOrderMilestoneTypes
}

export function getWorkOrderMilestoneTypeByWorkOrderMilestoneTypeId(
  workOrderMilestoneTypeId: number
): recordTypes.WorkOrderMilestoneType | undefined {
  const cachedWorkOrderMilestoneTypes = getWorkOrderMilestoneTypes()

  return cachedWorkOrderMilestoneTypes.find((currentWorkOrderMilestoneType) => {
    return (
      currentWorkOrderMilestoneType.workOrderMilestoneTypeId ===
      workOrderMilestoneTypeId
    )
  })
}

export function getWorkOrderMilestoneTypeByWorkOrderMilestoneType(
  workOrderMilestoneTypeString: string
): recordTypes.WorkOrderMilestoneType | undefined {
  const cachedWorkOrderMilestoneTypes = getWorkOrderMilestoneTypes()

  const workOrderMilestoneTypeLowerCase =
    workOrderMilestoneTypeString.toLowerCase()

  return cachedWorkOrderMilestoneTypes.find((currentWorkOrderMilestoneType) => {
    return (
      currentWorkOrderMilestoneType.workOrderMilestoneType.toLowerCase() ===
      workOrderMilestoneTypeLowerCase
    )
  })
}

function clearWorkOrderMilestoneTypesCache(): void {
  workOrderMilestoneTypes = undefined
}

export function clearCacheByTableName(tableName: string): void {
  switch (tableName) {
    case 'LotOccupantTypes': {
      clearLotOccupantTypesCache()
      break
    }

    case 'LotStatuses': {
      clearLotStatusesCache()
      break
    }

    case 'LotTypes':
    case 'LotTypeFields': {
      clearLotTypesCache()
      break
    }

    case 'OccupancyTypes':
    case 'OccupancyTypeFields':
    case 'OccupancyTypePrints': {
      clearOccupancyTypesCache()
      break
    }

    case 'WorkOrderMilestoneTypes': {
      clearWorkOrderMilestoneTypesCache()
      break
    }

    case 'WorkOrderTypes': {
      clearWorkOrderTypesCache()
      break
    }
  }
}
