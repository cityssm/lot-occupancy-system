import type { PoolConnection } from 'better-sqlite-pool';
export interface AddLotOccupancyForm {
    occupancyTypeId: string | number;
    lotId: string | number;
    occupancyStartDateString: string;
    occupancyEndDateString: string;
    occupancyTypeFieldIds?: string;
    [lotOccupancyFieldValue_occupancyTypeFieldId: string]: unknown;
    lotOccupantTypeId?: string;
    occupantName?: string;
    occupantFamilyName?: string;
    occupantAddress1?: string;
    occupantAddress2?: string;
    occupantCity?: string;
    occupantProvince?: string;
    occupantPostalCode?: string;
    occupantPhoneNumber?: string;
    occupantEmailAddress?: string;
    occupantComment?: string;
}
export default function addLotOccupancy(lotOccupancyForm: AddLotOccupancyForm, user: User, connectedDatabase?: PoolConnection): Promise<number>;
