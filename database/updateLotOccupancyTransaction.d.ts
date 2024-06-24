import { type DateString, type TimeString } from '@cityssm/utils-datetime';
export interface UpdateLotOccupancyTransactionForm {
    lotOccupancyId: string | number;
    transactionIndex: string | number;
    transactionDateString: DateString;
    transactionTimeString: TimeString;
    transactionAmount: string | number;
    externalReceiptNumber: string;
    transactionNote: string;
}
export default function updateLotOccupancyTransaction(lotOccupancyTransactionForm: UpdateLotOccupancyTransactionForm, user: User): Promise<boolean>;
