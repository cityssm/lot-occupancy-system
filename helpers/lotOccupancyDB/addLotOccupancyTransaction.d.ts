import type * as recordTypes from "../../types/recordTypes";
interface AddLotOccupancyTransactionForm {
    lotOccupancyId: string | number;
    transactionDateString?: string;
    transactionTimeString?: string;
    transactionAmount: string | number;
    externalReceiptNumber: string;
    transactionNote: string;
}
export declare const addLotOccupancyTransaction: (lotOccupancyTransactionForm: AddLotOccupancyTransactionForm, requestSession: recordTypes.PartialSession) => number;
export default addLotOccupancyTransaction;
