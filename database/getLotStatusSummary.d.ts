import type { LotStatus } from '../types/recordTypes.js';
interface GetFilters {
    mapId?: number | string;
}
interface LotStatusSummary extends LotStatus {
    lotCount: number;
}
export default function getLotStatusSummary(filters: GetFilters): Promise<LotStatusSummary[]>;
export {};
