interface UpdateLotOccupantTypeForm {
    lotOccupantTypeId: number | string;
    lotOccupantType: string;
    fontAwesomeIconClass: string;
    occupantCommentTitle: string;
}
export declare function updateLotOccupantType(lotOccupantTypeForm: UpdateLotOccupantTypeForm, user: User): Promise<boolean>;
export default updateLotOccupantType;
