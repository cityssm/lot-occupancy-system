import { type DateString } from '@cityssm/utils-datetime';
export interface UpdateLotOccupancyForm {
    lotOccupancyId: string | number;
    occupancyTypeId: string | number;
    lotId: string | number;
    occupancyStartDateString: DateString;
    occupancyEndDateString: DateString | '';
    occupancyTypeFieldIds?: string;
    [lotOccupancyFieldValue_occupancyTypeFieldId: string]: unknown;
}
export default function updateLotOccupancy(lotOccupancyForm: UpdateLotOccupancyForm, user: User): Promise<boolean>;
