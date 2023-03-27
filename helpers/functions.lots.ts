/* eslint-disable @typescript-eslint/indent */

import cluster from 'node:cluster'

import NodeCache from 'node-cache'

import getPreviousLotIdFromDatabase from './lotOccupancyDB/getPreviousLotId.js'
import getNextLotIdFromDatabase from './lotOccupancyDB/getNextLotId.js'

import type {
  CacheLotIdsWorkerMessage,
  ClearNextPreviousLotIdsCacheWorkerMessage
} from '../types/applicationTypes.js'

import Debug from 'debug'
const debug = Debug(`lot-occupancy-system:functions.lots:${process.pid}`)

const cacheOptions: NodeCache.Options = {
  stdTTL: 2 * 60, // two minutes
  useClones: false
}

const previousLotIdCache = new NodeCache(cacheOptions)

const nextLotIdCache = new NodeCache(cacheOptions)

function cacheLotIds(
  lotId: number,
  nextLotId: number,
  relayMessage = true
): void {
  previousLotIdCache.set(nextLotId, lotId)
  nextLotIdCache.set(lotId, nextLotId)

  try {
    if (relayMessage && cluster.isWorker) {
      const workerMessage: CacheLotIdsWorkerMessage = {
        messageType: 'cacheLotIds',
        lotId,
        nextLotId,
        timeMillis: Date.now(),
        pid: process.pid
      }

      debug(`Sending cache lot ids from worker: (${lotId}, ${nextLotId})`)

      process.send!(workerMessage)
    }
  } catch {}
}

export async function getNextLotId(lotId: number): Promise<number | undefined> {
  let nextLotId: number | undefined = nextLotIdCache.get(lotId)

  if (nextLotId === undefined) {
    nextLotId = await getNextLotIdFromDatabase(lotId)

    if (nextLotId !== undefined) {
      cacheLotIds(lotId, nextLotId)
    }
  }

  return nextLotId
}

export async function getPreviousLotId(
  lotId: number
): Promise<number | undefined> {
  let previousLotId: number | undefined = previousLotIdCache.get(lotId)

  if (previousLotId === undefined) {
    previousLotId = await getPreviousLotIdFromDatabase(lotId)

    if (previousLotId !== undefined) {
      cacheLotIds(previousLotId, lotId)
    }
  }

  return previousLotId
}

export function clearNextPreviousLotIdCache(
  lotId: number | -1,
  relayMessage = true
): void {
  if (lotId === undefined || lotId === -1) {
    previousLotIdCache.flushAll()
    nextLotIdCache.flushAll()
    return
  }

  const previousLotId: number | undefined = previousLotIdCache.get(lotId)

  if (previousLotId !== undefined) {
    nextLotIdCache.del(previousLotId)
    previousLotIdCache.del(lotId)
  }

  const nextLotId: number | undefined = nextLotIdCache.get(lotId)

  if (nextLotId !== undefined) {
    previousLotIdCache.del(nextLotId)
    nextLotIdCache.del(lotId)
  }

  try {
    if (relayMessage && cluster.isWorker) {
      const workerMessage: ClearNextPreviousLotIdsCacheWorkerMessage = {
        messageType: 'clearNextPreviousLotIdCache',
        lotId,
        timeMillis: Date.now(),
        pid: process.pid
      }

      debug(`Sending clear next/previous lot cache from worker: ${lotId}`)

      process.send!(workerMessage)
    }
  } catch {}
}

process.on(
  'message',
  (
    message:
      | ClearNextPreviousLotIdsCacheWorkerMessage
      | CacheLotIdsWorkerMessage
  ) => {
    if (message.pid !== process.pid) {
      switch (message.messageType) {
        case 'cacheLotIds': {
          debug(`Caching lot ids: (${message.lotId}, ${message.nextLotId})`)
          cacheLotIds(message.lotId, message.nextLotId, false)
          break
        }
        case 'clearNextPreviousLotIdCache': {
          debug(`Clearing next/previous lot cache: ${message.lotId}`)
          clearNextPreviousLotIdCache(message.lotId, false)
          break
        }
      }
    }
  }
)
