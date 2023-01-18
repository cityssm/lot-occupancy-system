import type * as recordTypes from '../../types/recordTypes';
export declare function getLotByLotName(lotName: string): Promise<recordTypes.Lot | undefined>;
export declare function getLot(lotId: number | string): Promise<recordTypes.Lot | undefined>;
export default getLot;
