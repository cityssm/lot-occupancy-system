import type * as recordTypes from '../../types/recordTypes';
interface AddLotOccupancyTransactionForm {
    lotOccupancyId: string | number;
    transactionDateString?: string;
    transactionTimeString?: string;
    transactionAmount: string | number;
    externalReceiptNumber: string;
    transactionNote: string;
}
export declare function addLotOccupancyTransaction(lotOccupancyTransactionForm: AddLotOccupancyTransactionForm, requestSession: recordTypes.PartialSession): Promise<number>;
export default addLotOccupancyTransaction;
