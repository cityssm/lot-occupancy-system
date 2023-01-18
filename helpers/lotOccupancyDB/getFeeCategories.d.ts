import type * as recordTypes from '../../types/recordTypes';
interface GetFeeCategoriesFilters {
    occupancyTypeId?: number | string;
    lotTypeId?: number | string;
}
interface GetFeeCategoriesOptions {
    includeFees?: boolean;
}
export declare function getFeeCategories(filters: GetFeeCategoriesFilters, options: GetFeeCategoriesOptions): Promise<recordTypes.FeeCategory[]>;
export default getFeeCategories;
