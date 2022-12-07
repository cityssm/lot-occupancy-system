import type * as recordTypes from "../../types/recordTypes";
export declare const getLotByLotName: (lotName: string) => recordTypes.Lot | undefined;
export declare const getLot: (lotId: number | string) => recordTypes.Lot;
export default getLot;
