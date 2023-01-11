declare type LotNameSearchType = 'startsWith' | 'endsWith' | '';
interface WhereClauseReturn {
    sqlWhereClause: string;
    sqlParameters: unknown[];
}
export declare function getLotNameWhereClause(lotName: string, lotNameSearchType: LotNameSearchType, lotsTableAlias?: string): WhereClauseReturn;
declare type OccupancyTime = '' | 'current' | 'past' | 'future';
export declare function getOccupancyTimeWhereClause(occupancyTime: OccupancyTime, lotOccupanciesTableAlias?: string): WhereClauseReturn;
export declare function getOccupantNameWhereClause(occupantName: string, tableAlias?: string): WhereClauseReturn;
export {};
