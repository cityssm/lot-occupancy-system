import * as importIds from './legacy.importFromCsv.ids.js'

import type * as recordTypes from '../types/recordTypes'

export function buildLotName(lotNamePieces: {
  cemetery: string
  block: string
  range1: string
  range2: string
  lot1: string
  lot2: string
  grave1: string
  grave2: string
  interment: string
}): string {
  return (
    lotNamePieces.cemetery +
    '-' +
    (lotNamePieces.block === '' ? '' : 'B' + lotNamePieces.block + '-') +
    (lotNamePieces.range1 === '0' && lotNamePieces.range2 === ''
      ? ''
      : 'R' +
        (lotNamePieces.range1 === '0' ? '' : lotNamePieces.range1) +
        lotNamePieces.range2 +
        '-') +
    (lotNamePieces.lot1 === '0' && lotNamePieces.lot2 === ''
      ? ''
      : 'L' + lotNamePieces.lot1 + lotNamePieces.lot2 + '-') +
    ('G' + lotNamePieces.grave1 + lotNamePieces.grave2) +
    ', ' +
    ('Interment ' + lotNamePieces.interment)
  )
}

export function getFuneralHomeLotOccupancyOccupantData(
  funeralHomeKey: string
): recordTypes.LotOccupancyOccupant {
  switch (funeralHomeKey) {
    case 'AR': {
      return {
        lotOccupantTypeId: importIds.funeralDirectorLotOccupantTypeId,
        occupantName: 'Arthur Funeral Home',
        occupantAddress1: '492 Wellington Street East',
        occupantAddress2: '',
        occupantCity: 'Sault Ste. Marie',
        occupantProvince: 'ON',
        occupantPostalCode: 'P6A 2L9',
        occupantPhoneNumber: '705-759-2522',
        occupantEmailAddress: ''
      }
    }
    case 'BG': {
      return {
        lotOccupantTypeId: importIds.funeralDirectorLotOccupantTypeId,
        occupantName: 'Beggs Funeral Home',
        occupantAddress1: '175 Main Street',
        occupantAddress2: 'P.O. Box 280',
        occupantCity: 'Thessalon',
        occupantProvince: 'ON',
        occupantPostalCode: 'P0R 1L0',
        occupantPhoneNumber: '705-842-2520',
        occupantEmailAddress: 'bfh@beggsfh.ca'
      }
    }
    case 'BK': {
      return {
        lotOccupantTypeId: importIds.funeralDirectorLotOccupantTypeId,
        occupantName: 'Barton and Kiteley',
        occupantAddress1: '',
        occupantAddress2: '',
        occupantCity: 'Sault Ste. Marie',
        occupantProvince: 'ON',
        occupantPostalCode: '',
        occupantPhoneNumber: '',
        occupantEmailAddress: ''
      }
    }
    case 'DA': {
      return {
        lotOccupantTypeId: importIds.funeralDirectorLotOccupantTypeId,
        occupantName: 'Damignani Burial, Cremation and Transfer Service',
        occupantAddress1: '215 St. James Street',
        occupantAddress2: '',
        occupantCity: 'Sault Ste. Marie',
        occupantProvince: 'ON',
        occupantPostalCode: 'P6A 1P7',
        occupantPhoneNumber: '705-759-8456',
        occupantEmailAddress: ''
      }
    }
    case 'GL': {
      return {
        lotOccupantTypeId: importIds.funeralDirectorLotOccupantTypeId,
        occupantName: 'Gilmartin P.M. Funeral Home',
        occupantAddress1: '140 Churchill Avenue',
        occupantAddress2: '',
        occupantCity: 'Wawa',
        occupantProvince: 'ON',
        occupantPostalCode: 'P0S 1K0',
        occupantPhoneNumber: '705-856-7340',
        occupantEmailAddress: ''
      }
    }
    case 'NO': {
      return {
        lotOccupantTypeId: importIds.funeralDirectorLotOccupantTypeId,
        occupantName: 'Northwood Funeral Home',
        occupantAddress1: '942 Great Northern Road',
        occupantAddress2: '',
        occupantCity: 'Sault Ste. Marie',
        occupantProvince: 'ON',
        occupantPostalCode: 'P6B 0B6',
        occupantPhoneNumber: '705-945-7758',
        occupantEmailAddress: ''
      }
    }
    case 'OS': {
      return {
        lotOccupantTypeId: importIds.funeralDirectorLotOccupantTypeId,
        occupantName: "O'Sullivan Funeral Home",
        occupantAddress1: '215 St. James Street',
        occupantAddress2: '',
        occupantCity: 'Sault Ste. Marie',
        occupantProvince: 'ON',
        occupantPostalCode: 'P6A 1P7',
        occupantPhoneNumber: '705-759-8456',
        occupantEmailAddress: ''
      }
    }
  }

  return {
    lotOccupantTypeId: importIds.funeralDirectorLotOccupantTypeId,
    occupantName: funeralHomeKey,
    occupantCity: 'Sault Ste. Marie',
    occupantProvince: 'ON'
  }
}