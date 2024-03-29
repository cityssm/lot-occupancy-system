import type * as recordTypes from '../types/recordTypes'

export const calculateFeeAmount = (
  fee: recordTypes.Fee,
  lotOccupancy: recordTypes.LotOccupancy
): number => {
  return fee.feeFunction ? 0 : fee.feeAmount ?? 0
}

export function calculateTaxAmount(fee: recordTypes.Fee, feeAmount: number): number {
  return fee.taxPercentage
    ? feeAmount * (fee.taxPercentage / 100)
    : fee.taxAmount ?? 0
}
