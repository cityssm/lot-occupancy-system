export interface AddLotOccupantTypeForm {
    lotOccupantType: string;
    fontAwesomeIconClass?: string;
    occupantCommentTitle?: string;
    orderNumber?: number;
}
export default function addLotOccupantType(lotOccupantTypeForm: AddLotOccupantTypeForm, user: User): Promise<number>;
