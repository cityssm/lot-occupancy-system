declare type LotNameSearchType = "startsWith" | "endsWith" | "";
export declare const getLotNameWhereClause: (lotName: string, lotNameSearchType: LotNameSearchType, lotsTableAlias?: string) => {
    sqlWhereClause: string;
    sqlParameters: any[];
};
declare type OccupancyTime = "" | "current" | "past" | "future";
export declare const getOccupancyTimeWhereClause: (occupancyTime: OccupancyTime, lotOccupanciesTableAlias?: string) => {
    sqlWhereClause: string;
    sqlParameters: any[];
};
export declare const getOccupantNameWhereClause: (occupantName: string, tableAlias?: string) => {
    sqlWhereClause: string;
    sqlParameters: any[];
};
export {};
