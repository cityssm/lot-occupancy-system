import type * as recordTypes from '../../types/recordTypes';
interface UpdateLotForm {
    lotId: string | number;
    lotName: string;
    lotTypeId: string | number;
    lotStatusId: string | number;
    mapId: string | number;
    mapKey: string;
    lotLatitude: string;
    lotLongitude: string;
    lotTypeFieldIds?: string;
    [lotFieldValue_lotTypeFieldId: string]: unknown;
}
export declare function updateLot(lotForm: UpdateLotForm, requestSession: recordTypes.PartialSession): Promise<boolean>;
export declare function updateLotStatus(lotId: number | string, lotStatusId: number | string, requestSession: recordTypes.PartialSession): Promise<boolean>;
export default updateLot;
