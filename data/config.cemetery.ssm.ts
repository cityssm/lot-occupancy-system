import { config as cemeteryConfig } from './config.cemetery.ontario.js'

export const config = Object.assign({}, cemeteryConfig)

config.aliases.occupancyStartDate = 'Purchase Date'
config.aliases.externalReceiptNumber = 'GP Receipt Number'

config.settings.lot.lotNamePattern =
  /^[\dA-Z]{2}-(B[\dA-Z]+-)?(R[\dA-Z]+-)?(L[\dA-Z]+-)?G[\dA-Z]+(, Interment \d+)?$/

config.settings.lot.lotNameHelpText = `Two digit cemetery-Block-Range-Lot-Grave, Interment number\n
    ex. XX-BA-R41-L15-G3A, Interment 1`

const numericPadding = '00000'

export function lotNameSortNameFunction(lotName: string): string {
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

    return cleanLotNamePieces.join('-')
  } catch {
    return lotName
  }
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
  lookupOrder: ['diamond/cashReceipt', 'invoice']
}

export default config
