declare type LotNameSearchType = "startsWith" | "endsWith" | "";
export declare function getLotNameWhereClause(lotName: string, lotNameSearchType: LotNameSearchType, lotsTableAlias?: string): {
    sqlWhereClause: string;
    sqlParameters: any[];
};
declare type OccupancyTime = "" | "current" | "past" | "future";
export declare function getOccupancyTimeWhereClause(occupancyTime: OccupancyTime, lotOccupanciesTableAlias?: string): {
    sqlWhereClause: string;
    sqlParameters: any[];
};
export declare function getOccupantNameWhereClause(occupantName: string, tableAlias?: string): {
    sqlWhereClause: string;
    sqlParameters: any[];
};
export {};
