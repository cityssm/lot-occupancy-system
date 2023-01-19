import NodeCache from 'node-cache'

import getPreviousLotIdFromDatabase from './lotOccupancyDB/getPreviousLotId.js'
import getNextLotIdFromDatabase from './lotOccupancyDB/getNextLotId.js'

const previousLotIdCache = new NodeCache({
  stdTTL: 2 * 60 // two minutes
})

const nextLotIdCache = new NodeCache({
  stdTTL: 2 * 60 // two minutes
})

export async function getNextLotId(lotId: number): Promise<number | undefined> {
  let nextLotId: number | undefined = nextLotIdCache.get(lotId)

  if (nextLotId === undefined) {
    nextLotId = await getNextLotIdFromDatabase(lotId)

    if (nextLotId !== undefined) {
      previousLotIdCache.set(nextLotId, lotId)
      nextLotIdCache.set(lotId, nextLotId)
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
      previousLotIdCache.set(lotId, previousLotId)
      nextLotIdCache.set(previousLotId, lotId)
    }
  }

  return previousLotId
}
