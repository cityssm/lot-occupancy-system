import type { LotType } from '../types/recordTypes.js';
interface GetFilters {
    mapId?: number | string;
}
interface LotTypeSummary extends LotType {
    lotCount: number;
}
export default function getLotTypeSummary(filters: GetFilters): Promise<LotTypeSummary[]>;
export {};
