import type * as recordTypes from '../../types/recordTypes';
export declare function deleteLotOccupancyTransaction(lotOccupancyId: number | string, transactionIndex: number | string, requestSession: recordTypes.PartialSession): Promise<boolean>;
export default deleteLotOccupancyTransaction;
