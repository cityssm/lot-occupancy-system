// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/indent */

import cluster from 'node:cluster'

import Debug from 'debug'

import type { ClearCacheWorkerMessage } from '../types/applicationTypes.js'
// eslint-disable-next-line import/namespace
import type * as recordTypes from '../types/recordTypes.js'

import * as configFunctions from './functions.config.js'
import { getLotOccupantTypes as getLotOccupantTypesFromDatabase } from './lotOccupancyDB/getLotOccupantTypes.js'
import { getLotStatuses as getLotStatusesFromDatabase } from './lotOccupancyDB/getLotStatuses.js'
import { getLotTypes as getLotTypesFromDatabase } from './lotOccupancyDB/getLotTypes.js'
import { getOccupancyTypeFields as getOccupancyTypeFieldsFromDatabase } from './lotOccupancyDB/getOccupancyTypeFields.js'
import { getOccupancyTypes as getOccupancyTypesFromDatabase } from './lotOccupancyDB/getOccupancyTypes.js'
import { getWorkOrderMilestoneTypes as getWorkOrderMilestoneTypesFromDatabase } from './lotOccupancyDB/getWorkOrderMilestoneTypes.js'
import { getWorkOrderTypes as getWorkOrderTypesFromDatabase } from './lotOccupancyDB/getWorkOrderTypes.js'

const debug = Debug(`lot-occupancy-system:functions.cache:${process.pid}`)

/*
 * Lot Occupant Types
 */

let lotOccupantTypes: recordTypes.LotOccupantType[] | undefined

export async function getLotOccupantTypes(): Promise<
  recordTypes.LotOccupantType[]
> {
  if (lotOccupantTypes === undefined) {
    lotOccupantTypes = await getLotOccupantTypesFromDatabase()
  }

  return lotOccupantTypes
}

export async function getLotOccupantTypeById(
  lotOccupantTypeId: number
): Promise<recordTypes.LotOccupantType | undefined> {
  const cachedLotOccupantTypes = await getLotOccupantTypes()

  return cachedLotOccupantTypes.find((currentLotOccupantType) => {
    return currentLotOccupantType.lotOccupantTypeId === lotOccupantTypeId
  })
}

export async function getLotOccupantTypeByLotOccupantType(
  lotOccupantType: string
): Promise<recordTypes.LotOccupantType | undefined> {
  const cachedLotOccupantTypes = await getLotOccupantTypes()

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

export async function getLotStatuses(): Promise<recordTypes.LotStatus[]> {
  if (lotStatuses === undefined) {
    lotStatuses = await getLotStatusesFromDatabase()
  }

  return lotStatuses
}

export async function getLotStatusById(
  lotStatusId: number
): Promise<recordTypes.LotStatus | undefined> {
  const cachedLotStatuses = await getLotStatuses()

  return cachedLotStatuses.find((currentLotStatus) => {
    return currentLotStatus.lotStatusId === lotStatusId
  })
}

export async function getLotStatusByLotStatus(
  lotStatus: string
): Promise<recordTypes.LotStatus | undefined> {
  const cachedLotStatuses = await getLotStatuses()

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

export async function getLotTypes(): Promise<recordTypes.LotType[]> {
  if (lotTypes === undefined) {
    lotTypes = await getLotTypesFromDatabase()
  }

  return lotTypes
}

export async function getLotTypeById(
  lotTypeId: number
): Promise<recordTypes.LotType | undefined> {
  const cachedLotTypes = await getLotTypes()

  return cachedLotTypes.find((currentLotType) => {
    return currentLotType.lotTypeId === lotTypeId
  })
}

export async function getLotTypesByLotType(
  lotType: string
): Promise<recordTypes.LotType | undefined> {
  const cachedLotTypes = await getLotTypes()

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

export async function getOccupancyTypes(): Promise<
  recordTypes.OccupancyType[]
> {
  if (occupancyTypes === undefined) {
    occupancyTypes = await getOccupancyTypesFromDatabase()
  }

  return occupancyTypes
}

export async function getAllOccupancyTypeFields(): Promise<
  recordTypes.OccupancyTypeField[]
> {
  if (allOccupancyTypeFields === undefined) {
    allOccupancyTypeFields = await getOccupancyTypeFieldsFromDatabase()
  }
  return allOccupancyTypeFields
}

export async function getOccupancyTypeById(
  occupancyTypeId: number
): Promise<recordTypes.OccupancyType | undefined> {
  const cachedOccupancyTypes = await getOccupancyTypes()

  return cachedOccupancyTypes.find((currentOccupancyType) => {
    return currentOccupancyType.occupancyTypeId === occupancyTypeId
  })
}

export async function getOccupancyTypeByOccupancyType(
  occupancyTypeString: string
): Promise<recordTypes.OccupancyType | undefined> {
  const cachedOccupancyTypes = await getOccupancyTypes()

  const occupancyTypeLowerCase = occupancyTypeString.toLowerCase()

  return cachedOccupancyTypes.find((currentOccupancyType) => {
    return (
      currentOccupancyType.occupancyType.toLowerCase() ===
      occupancyTypeLowerCase
    )
  })
}

export async function getOccupancyTypePrintsById(
  occupancyTypeId: number
): Promise<string[]> {
  const occupancyType = await getOccupancyTypeById(occupancyTypeId)

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

export async function getWorkOrderTypes(): Promise<
  recordTypes.WorkOrderType[]
> {
  if (workOrderTypes === undefined) {
    workOrderTypes = await getWorkOrderTypesFromDatabase()
  }

  return workOrderTypes
}

export async function getWorkOrderTypeById(
  workOrderTypeId: number
): Promise<recordTypes.WorkOrderType | undefined> {
  const cachedWorkOrderTypes = await getWorkOrderTypes()

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

export async function getWorkOrderMilestoneTypes(): Promise<
  recordTypes.WorkOrderMilestoneType[]
> {
  if (workOrderMilestoneTypes === undefined) {
    workOrderMilestoneTypes = await getWorkOrderMilestoneTypesFromDatabase()
  }

  return workOrderMilestoneTypes
}

export async function getWorkOrderMilestoneTypeById(
  workOrderMilestoneTypeId: number
): Promise<recordTypes.WorkOrderMilestoneType | undefined> {
  const cachedWorkOrderMilestoneTypes = await getWorkOrderMilestoneTypes()

  return cachedWorkOrderMilestoneTypes.find((currentWorkOrderMilestoneType) => {
    return (
      currentWorkOrderMilestoneType.workOrderMilestoneTypeId ===
      workOrderMilestoneTypeId
    )
  })
}

export async function getWorkOrderMilestoneTypeByWorkOrderMilestoneType(
  workOrderMilestoneTypeString: string
): Promise<recordTypes.WorkOrderMilestoneType | undefined> {
  const cachedWorkOrderMilestoneTypes = await getWorkOrderMilestoneTypes()

  const workOrderMilestoneTypeLowerCase =
    workOrderMilestoneTypeString.toLowerCase()

  return cachedWorkOrderMilestoneTypes.find((currentWorkOrderMilestoneType) => {
    return (
      currentWorkOrderMilestoneType.workOrderMilestoneType.toLowerCase() ===
      workOrderMilestoneTypeLowerCase
    )
  })
}

export async function preloadCaches(): Promise<void> {
  debug('Preloading caches')
  await getLotOccupantTypes()
  await getLotStatuses()
  await getLotTypes()
  await getOccupancyTypes()
  await getWorkOrderTypes()
  await getWorkOrderMilestoneTypes()
}

export function clearCaches(): void {
  clearLotOccupantTypesCache()
  clearLotStatusesCache()
  clearLotTypesCache()
  clearOccupancyTypesCache()
  clearWorkOrderTypesCache()
  clearWorkOrderMilestoneTypesCache()
}

function clearWorkOrderMilestoneTypesCache(): void {
  workOrderMilestoneTypes = undefined
}

export function clearCacheByTableName(
  tableName: string,
  relayMessage = true
): void {
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

  try {
    if (relayMessage && cluster.isWorker) {
      const workerMessage: ClearCacheWorkerMessage = {
        messageType: 'clearCache',
        tableName,
        timeMillis: Date.now(),
        pid: process.pid
      }

      debug(`Sending clear cache from worker: ${tableName}`)

      process.send!(workerMessage)
    }
  } catch {}
}

process.on('message', (message: ClearCacheWorkerMessage) => {
  if (message.messageType === 'clearCache' && message.pid !== process.pid) {
    debug(`Clearing cache: ${message.tableName}`)
    clearCacheByTableName(message.tableName, false)
  }
})
