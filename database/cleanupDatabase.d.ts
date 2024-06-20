export default function cleanupDatabase(user: User): Promise<{
    inactivatedRecordCount: number;
    purgedRecordCount: number;
}>;
