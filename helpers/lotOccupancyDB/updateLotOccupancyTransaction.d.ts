interface UpdateLotOccupancyTransactionForm {
    lotOccupancyId: string | number;
    transactionIndex: string | number;
    transactionDateString: string;
    transactionTimeString: string;
    transactionAmount: string | number;
    externalReceiptNumber: string;
    transactionNote: string;
}
export declare function updateLotOccupancyTransaction(lotOccupancyTransactionForm: UpdateLotOccupancyTransactionForm, user: User): Promise<boolean>;
export default updateLotOccupancyTransaction;
