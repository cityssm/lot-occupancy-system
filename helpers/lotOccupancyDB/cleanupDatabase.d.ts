import type * as recordTypes from '../../types/recordTypes';
export declare function cleanupDatabase(requestSession: recordTypes.PartialSession): Promise<{
    inactivatedRecordCount: number;
    purgedRecordCount: number;
}>;
export default cleanupDatabase;
