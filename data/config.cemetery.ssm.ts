import NodeCache from 'node-cache'

import type { Config } from '../types/configTypes.js'

import { config as cemeteryConfig } from './config.cemetery.ontario.js'

export const config: Config = { ...cemeteryConfig}

config.aliases.occupancyStartDate = 'Purchase Date'
config.aliases.externalReceiptNumber = 'GP Receipt Number'

config.settings.lot.lotNamePattern =
  /^[\dA-Z]{2}-(B[\dA-Z]+-)?(R[\dA-Z]+-)?(L[\dA-Z]+-)?G[\dA-Z]+(, Interment \d+)?$/

config.settings.lot.lotNameHelpText = `Two digit cemetery-Block-Range-Lot-Grave, Interment number\n
    ex. XX-BA-R41-L15-G3A, Interment 1`

const numericPadding = '00000'

const lotNameSortNameCache = new NodeCache({
  stdTTL: 5 * 60,
  useClones: false
})

export function lotNameSortNameFunction(lotName: string): string {
  let sortName: string = lotNameSortNameCache.get(lotName) ?? ''

  if (sortName === '') {
    try {
      const lotNameSplit = lotName.toUpperCase().split('-')

      const cleanLotNamePieces: string[] = []

      for (let lotNamePiece of lotNameSplit) {
        if (cleanLotNamePieces.length === 0) {
          cleanLotNamePieces.push(lotNamePiece)
          continue
        }

        let numericPiece = numericPadding
        let letterPiece = ''

        const firstLetter = lotNamePiece.charAt(0)
        lotNamePiece = lotNamePiece.slice(1)

        for (const letter of lotNamePiece) {
          if (letterPiece === '' && '0123456789'.includes(letter)) {
            numericPiece += letter
          } else {
            letterPiece += letter
          }
        }

        cleanLotNamePieces.push(
          firstLetter +
            numericPiece.slice(-1 * numericPadding.length) +
            letterPiece
        )
      }

      sortName = cleanLotNamePieces.join('-')
    } catch {
      sortName = lotName
    }

    lotNameSortNameCache.set(lotName, sortName)
  }

  return sortName
}

config.settings.lot.lotNameSortNameFunction = lotNameSortNameFunction

config.settings.lotOccupancy.occupantCityDefault = 'Sault Ste. Marie'
config.settings.lotOccupancy.prints = [
  'pdf/ssm.cemetery.burialPermit',
  'pdf/ssm.cemetery.contract'
]

config.settings.map.mapCityDefault = 'Sault Ste. Marie'

config.settings.workOrders.workOrderNumberLength = 6
config.settings.workOrders.workOrderMilestoneDateRecentBeforeDays = 7
config.settings.workOrders.workOrderMilestoneDateRecentAfterDays = 30

config.settings.dynamicsGP = {
  integrationIsEnabled: true,
  lookupOrder: ['diamond/cashReceipt', 'diamond/extendedInvoice']
}

export default config
