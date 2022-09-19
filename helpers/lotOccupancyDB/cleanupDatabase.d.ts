import type * as recordTypes from "../../types/recordTypes";
export declare const cleanupDatabase: (requestSession: recordTypes.PartialSession) => {
    inactivedRecordCount: number;
    purgedRecordCount: number;
};
export default cleanupDatabase;
