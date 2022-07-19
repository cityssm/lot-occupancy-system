import type * as recordTypes from "../../types/recordTypes";
interface GetOccupantsFilters {
    occupantName?: string;
    occupantAddress?: string;
    occupantCity?: string;
    occupantPostalCode?: string;
    occupantPhoneNumber?: string;
}
export declare const getOccupants: (filters?: GetOccupantsFilters) => recordTypes.Occupant[];
export default getOccupants;
