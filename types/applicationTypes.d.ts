export interface WorkerMessage {
    messageType: string;
    timeMillis: number;
    pid: number;
}
export interface ClearCacheWorkerMessage extends WorkerMessage {
    messageType: 'clearCache';
    tableName: string;
}
export interface CacheLotIdsWorkerMessage extends WorkerMessage {
    messageType: 'cacheLotIds';
    lotId: number;
    nextLotId: number;
}
export interface ClearNextPreviousLotIdsCacheWorkerMessage extends WorkerMessage {
    messageType: 'clearNextPreviousLotIdCache';
    lotId: number;
}
