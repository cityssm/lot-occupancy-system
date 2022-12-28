import { dateToInteger } from "@cityssm/expressjs-server-js/dateTimeFns.js";

type LotNameSearchType = "startsWith" | "endsWith" | "";

export const getLotNameWhereClause = (
    lotName: string,
    lotNameSearchType: LotNameSearchType,
    lotsTableAlias = "l"
) => {
    let sqlWhereClause = "";
    const sqlParameters = [];

    if (lotName) {
        switch (lotNameSearchType) {
            case "startsWith": {
                sqlWhereClause += " and " + lotsTableAlias + ".lotName like ? || '%'";
                sqlParameters.push(lotName);
                break;
            }
            case "endsWith": {
                sqlWhereClause += " and " + lotsTableAlias + ".lotName like '%' || ?";
                sqlParameters.push(lotName);
                break;
            }
            default: {
                const lotNamePieces = lotName.toLowerCase().split(" ");
                for (const lotNamePiece of lotNamePieces) {
                    sqlWhereClause += " and instr(lower(" + lotsTableAlias + ".lotName), ?)";
                    sqlParameters.push(lotNamePiece);
                }
            }
        }
    }

    return {
        sqlWhereClause,
        sqlParameters
    };
};

type OccupancyTime = "" | "current" | "past" | "future";

export const getOccupancyTimeWhereClause = (
    occupancyTime: OccupancyTime,
    lotOccupanciesTableAlias = "o"
) => {
    let sqlWhereClause = "";
    const sqlParameters = [];

    if (occupancyTime) {
        const currentDateString = dateToInteger(new Date());

        switch (occupancyTime) {
            case "current": {
                sqlWhereClause +=
                    " and " +
                    lotOccupanciesTableAlias +
                    ".occupancyStartDate <= ? and (" +
                    lotOccupanciesTableAlias +
                    ".occupancyEndDate is null or " +
                    lotOccupanciesTableAlias +
                    ".occupancyEndDate >= ?)";
                sqlParameters.push(currentDateString, currentDateString);
                break;
            }

            case "past": {
                sqlWhereClause += " and " + lotOccupanciesTableAlias + ".occupancyEndDate < ?";
                sqlParameters.push(currentDateString);
                break;
            }

            case "future": {
                sqlWhereClause += " and " + lotOccupanciesTableAlias + ".occupancyStartDate > ?";
                sqlParameters.push(currentDateString);
                break;
            }
        }
    }

    return {
        sqlWhereClause,
        sqlParameters
    };
};

export const getOccupantNameWhereClause = (occupantName: string, tableAlias = "o") => {
    let sqlWhereClause = "";
    const sqlParameters = [];

    if (occupantName) {
        const occupantNamePieces = occupantName.toLowerCase().split(" ");
        for (const occupantNamePiece of occupantNamePieces) {
            sqlWhereClause +=
                " and " +
                tableAlias +
                ".lotOccupancyId in (select lotOccupancyId from LotOccupancyOccupants where recordDelete_timeMillis is null and instr(lower(occupantName), ?))";
            sqlParameters.push(occupantNamePiece);
        }
    }

    return {
        sqlWhereClause,
        sqlParameters
    };
};
