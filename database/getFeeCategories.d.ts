import type { FeeCategory } from '../types/recordTypes.js';
interface GetFeeCategoriesFilters {
    occupancyTypeId?: number | string;
    lotTypeId?: number | string;
}
interface GetFeeCategoriesOptions {
    includeFees?: boolean;
}
export declare function getFeeCategories(filters: GetFeeCategoriesFilters, options: GetFeeCategoriesOptions): Promise<FeeCategory[]>;
export default getFeeCategories;
