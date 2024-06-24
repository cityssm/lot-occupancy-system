import type * as recordTypes from '../types/recordTypes'

export function filterOccupantsByLotOccupantType(
  lotOccupancy: recordTypes.LotOccupancy,
  lotOccupantType: string
): recordTypes.LotOccupancyOccupant[] {
  const lotOccupantTypeLowerCase = lotOccupantType.toLowerCase()

  return (lotOccupancy.lotOccupancyOccupants ?? []).filter(
    (possibleOccupant) => {
      return (
        (possibleOccupant.lotOccupantType as string).toLowerCase() ===
        lotOccupantTypeLowerCase
      )
    }
  )
}

export function getFieldValueByOccupancyTypeField(
  lotOccupancy: recordTypes.LotOccupancy,
  occupancyTypeField: string
): string | undefined {
  const occupancyTypeFieldLowerCase = occupancyTypeField.toLowerCase()

  const field = (lotOccupancy.lotOccupancyFields ?? []).find(
    (possibleField) => {
      return (
        (possibleField.occupancyTypeField as string).toLowerCase() ===
        occupancyTypeFieldLowerCase
      )
    }
  )

  if (field === undefined) {
    return undefined
  }

  return field.lotOccupancyFieldValue
}

export function getFeesByFeeCategory(
  lotOccupancy: recordTypes.LotOccupancy,
  feeCategory: string,
  feeCategoryContains = false
): recordTypes.LotOccupancyFee[] {
  const feeCategoryLowerCase = feeCategory.toLowerCase()

  return (lotOccupancy.lotOccupancyFees ?? []).filter((possibleFee) => {
    return feeCategoryContains
      ? (possibleFee.feeCategory as string)
          .toLowerCase()
          .includes(feeCategoryLowerCase)
      : (possibleFee.feeCategory as string).toLowerCase() ===
          feeCategoryLowerCase
  })
}

export function getTransactionTotal(
  lotOccupancy: recordTypes.LotOccupancy
): number {
  let transactionTotal = 0

  for (const transaction of lotOccupancy.lotOccupancyTransactions ?? []) {
    transactionTotal += transaction.transactionAmount
  }

  return transactionTotal
}
