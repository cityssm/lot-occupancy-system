import type * as recordTypes from '../../types/recordTypes';
export declare function cleanupDatabase(requestSession: recordTypes.PartialSession): {
    inactivedRecordCount: number;
    purgedRecordCount: number;
};
export default cleanupDatabase;
