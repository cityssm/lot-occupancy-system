import type { Fee, LotOccupancy } from '../types/recordTypes.js';
export declare function calculateFeeAmount(fee: Fee, lotOccupancy: LotOccupancy): number;
export declare function calculateTaxAmount(fee: Fee, feeAmount: number): number;
