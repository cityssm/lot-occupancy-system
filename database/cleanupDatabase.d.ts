export declare function cleanupDatabase(user: User): Promise<{
    inactivatedRecordCount: number;
    purgedRecordCount: number;
}>;
export default cleanupDatabase;
