import { dateToInteger } from '@cityssm/utils-datetime'

type LotNameSearchType = 'startsWith' | 'endsWith' | ''

interface WhereClauseReturn {
  sqlWhereClause: string
  sqlParameters: unknown[]
}

export function getLotNameWhereClause(
  lotName = '',
  lotNameSearchType: LotNameSearchType = '',
  lotsTableAlias = 'l'
): WhereClauseReturn {
  let sqlWhereClause = ''
  const sqlParameters: unknown[] = []

  if (lotName !== '') {
    switch (lotNameSearchType ?? '') {
      case 'startsWith': {
        sqlWhereClause += ` and ${lotsTableAlias}.lotName like ? || '%'`
        sqlParameters.push(lotName)
        break
      }
      case 'endsWith': {
        sqlWhereClause += ` and ${lotsTableAlias}.lotName like '%' || ?`
        sqlParameters.push(lotName)
        break
      }
      default: {
        const usedPieces = new Set<string>()

        const lotNamePieces = lotName.toLowerCase().split(' ')

        for (const lotNamePiece of lotNamePieces) {
          if (lotNamePiece === '' || usedPieces.has(lotNamePiece)) {
            continue
          }

          usedPieces.add(lotNamePiece)

          sqlWhereClause += ` and instr(lower(${lotsTableAlias}.lotName), ?)`
          sqlParameters.push(lotNamePiece)
        }
      }
    }
  }

  return {
    sqlWhereClause,
    sqlParameters
  }
}

type OccupancyTime = '' | 'current' | 'past' | 'future'

export function getOccupancyTimeWhereClause(
  occupancyTime: OccupancyTime | undefined,
  lotOccupanciesTableAlias = 'o'
): WhereClauseReturn {
  let sqlWhereClause = ''
  const sqlParameters: unknown[] = []

  const currentDateString = dateToInteger(new Date())

  switch (occupancyTime ?? '') {
    case 'current': {
      sqlWhereClause += ` and ${lotOccupanciesTableAlias}.occupancyStartDate <= ?
        and (${lotOccupanciesTableAlias}.occupancyEndDate is null or ${lotOccupanciesTableAlias}.occupancyEndDate >= ?)`
      sqlParameters.push(currentDateString, currentDateString)
      break
    }

    case 'past': {
      sqlWhereClause +=
        ` and ${lotOccupanciesTableAlias}.occupancyEndDate < ?`
      sqlParameters.push(currentDateString)
      break
    }

    case 'future': {
      sqlWhereClause +=
        ` and ${lotOccupanciesTableAlias}.occupancyStartDate > ?`
      sqlParameters.push(currentDateString)
      break
    }
  }

  return {
    sqlWhereClause,
    sqlParameters
  }
}

export function getOccupantNameWhereClause(
  occupantName = '',
  tableAlias = 'o'
): WhereClauseReturn {
  let sqlWhereClause = ''
  const sqlParameters: unknown[] = []

  const usedPieces = new Set<string>()

  const occupantNamePieces = occupantName.toLowerCase().split(' ')
  for (const occupantNamePiece of occupantNamePieces) {
    if (occupantNamePiece === '' || usedPieces.has(occupantNamePiece)) {
      continue
    }

    usedPieces.add(occupantNamePiece)

    sqlWhereClause += ` and (instr(lower(${tableAlias}.occupantName), ?) or instr(lower(${tableAlias}.occupantFamilyName), ?))`
    sqlParameters.push(occupantNamePiece, occupantNamePiece)
  }

  return {
    sqlWhereClause,
    sqlParameters
  }
}
