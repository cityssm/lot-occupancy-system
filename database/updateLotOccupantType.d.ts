export interface UpdateLotOccupantTypeForm {
    lotOccupantTypeId: number | string;
    lotOccupantType: string;
    fontAwesomeIconClass: string;
    occupantCommentTitle: string;
}
export default function updateLotOccupantType(lotOccupantTypeForm: UpdateLotOccupantTypeForm, user: User): Promise<boolean>;
