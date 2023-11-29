interface AddLotOccupancyTransactionForm {
    lotOccupancyId: string | number;
    transactionDateString?: string;
    transactionTimeString?: string;
    transactionAmount: string | number;
    externalReceiptNumber: string;
    transactionNote: string;
}
export declare function addLotOccupancyTransaction(lotOccupancyTransactionForm: AddLotOccupancyTransactionForm, user: User): Promise<number>;
export default addLotOccupancyTransaction;
