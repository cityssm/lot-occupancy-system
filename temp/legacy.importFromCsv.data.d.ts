import type { LotOccupancyOccupant } from '../types/recordTypes.js';
export declare function buildLotName(lotNamePieces: {
    cemetery: string;
    block: string;
    range1: string;
    range2: string;
    lot1: string;
    lot2: string;
    grave1: string;
    grave2: string;
    interment: string;
}): string;
export declare function getFuneralHomeLotOccupancyOccupantData(funeralHomeKey: string): LotOccupancyOccupant;
export declare function getDeathAgePeriod(legacyDeathAgePeriod: string): string;
