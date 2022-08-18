import * as recordTypes from "../types/recordTypes";
export declare const calculateFeeAmount: (fee: recordTypes.Fee, lotOccupancy: recordTypes.LotOccupancy) => number;
export declare const calculateTaxAmount: (fee: recordTypes.Fee, feeAmount: number) => number;
