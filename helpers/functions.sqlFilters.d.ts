type LotNameSearchType = 'startsWith' | 'endsWith' | '';
interface WhereClauseReturn {
    sqlWhereClause: string;
    sqlParameters: unknown[];
}
export declare function getLotNameWhereClause(lotName: string | undefined, lotNameSearchType: LotNameSearchType | undefined, lotsTableAlias?: string): WhereClauseReturn;
type OccupancyTime = '' | 'current' | 'past' | 'future';
export declare function getOccupancyTimeWhereClause(occupancyTime: OccupancyTime | undefined, lotOccupanciesTableAlias?: string): WhereClauseReturn;
export declare function getOccupantNameWhereClause(occupantName?: string, tableAlias?: string): WhereClauseReturn;
export {};
