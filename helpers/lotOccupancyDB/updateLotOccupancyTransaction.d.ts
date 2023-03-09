import type * as recordTypes from '../../types/recordTypes';
interface UpdateLotOccupancyTransactionForm {
    lotOccupancyId: string | number;
    transactionIndex: string | number;
    transactionDateString: string;
    transactionTimeString: string;
    transactionAmount: string | number;
    externalReceiptNumber: string;
    transactionNote: string;
}
export declare function updateLotOccupancyTransaction(lotOccupancyTransactionForm: UpdateLotOccupancyTransactionForm, requestSession: recordTypes.PartialSession): Promise<boolean>;
export default updateLotOccupancyTransaction;
