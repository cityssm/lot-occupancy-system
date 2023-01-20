export declare function getNextLotId(lotId: number): Promise<number | undefined>;
export declare function getPreviousLotId(lotId: number): Promise<number | undefined>;
export declare function clearNextPreviousLotIdCache(lotId?: number): void;
