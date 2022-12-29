import type * as recordTypes from "../../types/recordTypes";
export declare function getLotByLotName(lotName: string): recordTypes.Lot | undefined;
export declare function getLot(lotId: number | string): recordTypes.Lot;
export default getLot;
