import type * as recordTypes from '../types/recordTypes';
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
export declare function getFuneralHomeLotOccupancyOccupantData(funeralHomeKey: string): recordTypes.LotOccupancyOccupant;
