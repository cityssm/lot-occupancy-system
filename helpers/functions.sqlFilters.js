import { dateToInteger } from '@cityssm/expressjs-server-js/dateTimeFns.js';
export function getLotNameWhereClause(lotName = '', lotNameSearchType, lotsTableAlias = 'l') {
    let sqlWhereClause = '';
    const sqlParameters = [];
    if (lotName !== '') {
        switch (lotNameSearchType) {
            case 'startsWith': {
                sqlWhereClause += ' and ' + lotsTableAlias + ".lotName like ? || '%'";
                sqlParameters.push(lotName);
                break;
            }
            case 'endsWith': {
                sqlWhereClause += ' and ' + lotsTableAlias + ".lotName like '%' || ?";
                sqlParameters.push(lotName);
                break;
            }
            default: {
                const lotNamePieces = lotName.toLowerCase().split(' ');
                for (const lotNamePiece of lotNamePieces) {
                    if (lotNamePiece === '') {
                        continue;
                    }
                    sqlWhereClause +=
                        ' and instr(lower(' + lotsTableAlias + '.lotName), ?)';
                    sqlParameters.push(lotNamePiece);
                }
            }
        }
    }
    return {
        sqlWhereClause,
        sqlParameters
    };
}
export function getOccupancyTimeWhereClause(occupancyTime, lotOccupanciesTableAlias = 'o') {
    let sqlWhereClause = '';
    const sqlParameters = [];
    const currentDateString = dateToInteger(new Date());
    switch (occupancyTime ?? '') {
        case 'current': {
            sqlWhereClause +=
                ' and ' +
                    lotOccupanciesTableAlias +
                    '.occupancyStartDate <= ? and (' +
                    lotOccupanciesTableAlias +
                    '.occupancyEndDate is null or ' +
                    lotOccupanciesTableAlias +
                    '.occupancyEndDate >= ?)';
            sqlParameters.push(currentDateString, currentDateString);
            break;
        }
        case 'past': {
            sqlWhereClause +=
                ' and ' + lotOccupanciesTableAlias + '.occupancyEndDate < ?';
            sqlParameters.push(currentDateString);
            break;
        }
        case 'future': {
            sqlWhereClause +=
                ' and ' + lotOccupanciesTableAlias + '.occupancyStartDate > ?';
            sqlParameters.push(currentDateString);
            break;
        }
    }
    return {
        sqlWhereClause,
        sqlParameters
    };
}
export function getOccupantNameWhereClause(occupantName = '', tableAlias = 'o') {
    let sqlWhereClause = '';
    const sqlParameters = [];
    if (occupantName !== '') {
        const occupantNamePieces = occupantName.toLowerCase().split(' ');
        for (const occupantNamePiece of occupantNamePieces) {
            if (occupantNamePiece === '') {
                continue;
            }
            sqlWhereClause += ` and (instr(lower(${tableAlias}.occupantName), ?)
        or instr(lower(${tableAlias}.occupantFamilyName), ?))`;
            sqlParameters.push(occupantNamePiece, occupantNamePiece);
        }
    }
    return {
        sqlWhereClause,
        sqlParameters
    };
}
