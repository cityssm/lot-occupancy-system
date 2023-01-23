import type * as recordTypes from '../../types/recordTypes';
interface UpdateLotOccupantTypeForm {
    lotOccupantTypeId: number | string;
    lotOccupantType: string;
    fontAwesomeIconClass: string;
    occupantCommentTitle: string;
}
export declare function updateLotOccupantType(lotOccupantTypeForm: UpdateLotOccupantTypeForm, requestSession: recordTypes.PartialSession): Promise<boolean>;
export default updateLotOccupantType;
