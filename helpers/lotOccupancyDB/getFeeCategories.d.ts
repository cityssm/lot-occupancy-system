import type * as recordTypes from "../../types/recordTypes";
interface GetFeeCategoriesFilters {
    occupancyTypeId?: number | string;
    lotTypeId?: number | string;
}
interface GetFeeCategoriesOptions {
    includeFees?: boolean;
}
export declare const getFeeCategories: (filters?: GetFeeCategoriesFilters, options?: GetFeeCategoriesOptions) => recordTypes.FeeCategory[];
export default getFeeCategories;
