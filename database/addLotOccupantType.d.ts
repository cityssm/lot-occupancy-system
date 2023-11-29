interface AddLotOccupantTypeForm {
    lotOccupantType: string;
    fontAwesomeIconClass?: string;
    occupantCommentTitle?: string;
    orderNumber?: number;
}
export declare function addLotOccupantType(lotOccupantTypeForm: AddLotOccupantTypeForm, user: User): Promise<number>;
export default addLotOccupantType;
