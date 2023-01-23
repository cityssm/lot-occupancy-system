/* eslint-disable node/no-extraneous-import, node/no-unpublished-import */

import fs from 'node:fs'
import papa from 'papaparse'

import sqlite from 'better-sqlite3'

import { lotOccupancyDB as databasePath } from '../data/databasePaths.js'

import * as importIds from './legacy.importFromCsv.ids.js'
import * as importData from './legacy.importFromCsv.data.js'

import { addMap } from '../helpers/lotOccupancyDB/addMap.js'
import { getMap as getMapFromDatabase } from '../helpers/lotOccupancyDB/getMap.js'

import { addLot } from '../helpers/lotOccupancyDB/addLot.js'
import { updateLotStatus } from '../helpers/lotOccupancyDB/updateLot.js'

import { addLotOccupancy } from '../helpers/lotOccupancyDB/addLotOccupancy.js'

import { addLotOccupancyOccupant } from '../helpers/lotOccupancyDB/addLotOccupancyOccupant.js'

import { addLotOccupancyComment } from '../helpers/lotOccupancyDB/addLotOccupancyComment.js'

import { addOrUpdateLotOccupancyField } from '../helpers/lotOccupancyDB/addOrUpdateLotOccupancyField.js'

import { getLot, getLotByLotName } from '../helpers/lotOccupancyDB/getLot.js'

import { getLotOccupancies } from '../helpers/lotOccupancyDB/getLotOccupancies.js'

import { addLotOccupancyFee } from '../helpers/lotOccupancyDB/addLotOccupancyFee.js'

import { addLotOccupancyTransaction } from '../helpers/lotOccupancyDB/addLotOccupancyTransaction.js'

import { addWorkOrder } from '../helpers/lotOccupancyDB/addWorkOrder.js'

import { addWorkOrderLot } from '../helpers/lotOccupancyDB/addWorkOrderLot.js'

import { addWorkOrderLotOccupancy } from '../helpers/lotOccupancyDB/addWorkOrderLotOccupancy.js'

import {
  getWorkOrder,
  getWorkOrderByWorkOrderNumber
} from '../helpers/lotOccupancyDB/getWorkOrder.js'

import { reopenWorkOrder } from '../helpers/lotOccupancyDB/reopenWorkOrder.js'

import { addWorkOrderMilestone } from '../helpers/lotOccupancyDB/addWorkOrderMilestone.js'

import { closeWorkOrder } from '../helpers/lotOccupancyDB/closeWorkOrder.js'

import {
  dateIntegerToString,
  dateToString
} from '@cityssm/expressjs-server-js/dateTimeFns.js'

import type * as recordTypes from '../types/recordTypes'

interface MasterRecord {
  CM_SYSREC: string
  CM_CEMETERY: string
  CM_BLOCK: string
  CM_RANGE1: string
  CM_RANGE2: string
  CM_LOT1: string
  CM_LOT2: string
  CM_GRAVE1: string
  CM_GRAVE2: string
  CM_INTERMENT: string
  CM_PRENEED_OWNER: string
  CM_PRENEED_OWNER_SEQ: string
  CM_DECEASED_NAME: string
  CM_DECEASED_NAME_SEQ: string
  CM_ADDRESS: string
  CM_CITY: string
  CM_PROV: string
  CM_POST1: string
  CM_POST2: string
  CM_PRENEED_ORDER: string
  CM_PURCHASE_YR: string
  CM_PURCHASE_MON: string
  CM_PURCHASE_DAY: string
  CM_NO_GRAVES: string
  CM_DEATH_YR: string
  CM_DEATH_MON: string
  CM_DEATH_DAY: string
  CM_WORK_ORDER: string
  CM_INTERMENT_YR: string
  CM_INTERMENT_MON: string
  CM_INTERMENT_DAY: string
  CM_AGE: string
  CM_CONTAINER_TYPE: string
  CM_COMMITTAL_TYPE: string
  CM_CREMATION: string
  CM_FUNERAL_HOME: string
  CM_FUNERAL_YR: string
  CM_FUNERAL_MON: string
  CM_FUNERAL_DAY: string
  CM_RESIDENT_TYPE: string
  CM_REMARK1: string
  CM_REMARK2: string
  CM_STATUS: string
  CM_PERIOD: string
  CM_LAST_CHG_DATE: string
  CM_DEPTH: string
}

interface PrepaidRecord {
  CMPP_SYSREC: string
  CMPP_PREPAID_FOR_NAME: string
  CMPP_PREPAID_FOR_SEQ: string
  CMPP_ADDRESS: string
  CMPP_CITY: string
  CMPP_PROV: string
  CMPP_POSTAL1: string
  CMPP_POSTAL2: string
  CMPP_ARRANGED_BY_NAME: string
  CMPP_ARRANGED_BY_SEQ: string
  CMPP_CEMETERY: string
  CMPP_BLOCK: string
  CMPP_RANGE1: string
  CMPP_RANGE2: string
  CMPP_LOT1: string
  CMPP_LOT2: string
  CMPP_GRAVE1: string
  CMPP_GRAVE2: string
  CMPP_INTERMENT: string
  CMPP_ORDER_NO: string
  CMPP_PURCH_YR: string
  CMPP_PURCH_MON: string
  CMPP_PURCH_DAY: string
  CMPP_FEE_GRAV_SD: string
  CMPP_GST_GRAV_SD: string
  CMPP_FEE_GRAV_DD: string
  CMPP_GST_GRAV_DD: string
  CMPP_FEE_CHAP_SD: string
  CMPP_GST_CHAP_SD: string
  CMPP_FEE_CHAP_DD: string
  CMPP_GST_CHAP_DD: string
  CMPP_FEE_ENTOMBMENT: string
  CMPP_GST_ENTOMBMENT: string
  CMPP_FEE_CREM: string
  CMPP_GST_CREM: string
  CMPP_FEE_NICHE: string
  CMPP_GST_NICHE: string
  CMPP_FEE_DISINTERMENT: string
  CMPP_GST_DISINTERMENT: string
  CMPP_REMARK1: string
  CMPP_REMARK2: string
}

interface WorkOrderRecord {
  WO_SYSREC: string
  WO_DECEASED_NAME: string
  WO_DECEASED_SEQ: string
  WO_CEMETERY: string
  WO_BLOCK: string
  WO_RANGE1: string
  WO_RANGE2: string
  WO_LOT1: string
  WO_LOT2: string
  WO_GRAVE1: string
  WO_GRAVE2: string
  WO_INTERMENT: string
  WO_ADDRESS: string
  WO_CITY: string
  WO_PROV: string
  WO_POST1: string
  WO_POST2: string
  WO_DEATH_YR: string
  WO_DEATH_MON: string
  WO_DEATH_DAY: string
  WO_AGE: string
  WO_FUNERAL_HOME: string
  WO_FUNERAL_YR: string
  WO_FUNERAL_MON: string
  WO_FUNERAL_DAY: string
  WO_FUNERAL_HR: string
  WO_FUNERAL_MIN: string
  WO_INTERMENT_YR: string
  WO_INTERMENT_MON: string
  WO_INTERMENT_DAY: string
  WO_COST: string
  WO_COMMITTAL_TYPE: string
  WO_CONTAINER_TYPE: string
  WO_CREMATION: string
  WO_CONFIRMATION_IN: string
  WO_COMPLETION_YR: string
  WO_COMPLETION_MON: string
  WO_COMPLETION_DAY: string
  WO_INITIATION_DATE: string
  WO_WORK_ORDER: string
  WO_REMARK1: string
  WO_REMARK2: string
  WO_REMARK3: string
  WO_PERIOD: string
  WO_RESIDENT_TYPE: string
  WO_DEPTH: string
  WO_DEATH_PLACE: string
}

const user: recordTypes.PartialSession = {
  user: {
    userName: 'import.unix',
    userProperties: {
      canUpdate: true,
      isAdmin: false,
      apiKey: ''
    }
  }
}

function purgeTables(): void {
  console.time('purgeTables')

  const database = sqlite(databasePath)
  database.prepare('delete from WorkOrderMilestones').run()
  database.prepare('delete from WorkOrderComments').run()
  database.prepare('delete from WorkOrderLots').run()
  database.prepare('delete from WorkOrderLotOccupancies').run()
  database.prepare('delete from WorkOrders').run()
  database.prepare('delete from LotOccupancyTransactions').run()
  database.prepare('delete from LotOccupancyFees').run()
  database.prepare('delete from LotOccupancyFields').run()
  database.prepare('delete from LotOccupancyComments').run()
  database.prepare('delete from LotOccupancyOccupants').run()
  database.prepare('delete from LotOccupancies').run()
  database.prepare('delete from LotFields').run()
  database.prepare('delete from LotComments').run()
  database.prepare('delete from Lots').run()
  database
    .prepare(
      "delete from sqlite_sequence where name in ('Lots', 'LotComments', 'LotOccupancies', 'LotOccupancyComments', 'WorkOrders', 'WorkOrderComments', 'WorkOrderMilestones')"
    )
    .run()
  database.close()

  console.timeEnd('purgeTables')
}

function purgeConfigTables(): void {
  console.time('purgeConfigTables')

  const database = sqlite(databasePath)
  database.prepare('delete from Maps').run()
  database.prepare("delete from sqlite_sequence where name in ('Maps')").run()
  database.close()

  console.timeEnd('purgeConfigTables')
}

function getMapByMapDescription(mapDescription: string): recordTypes.Map {
  const database = sqlite(databasePath, {
    readonly: true
  })

  const map: recordTypes.Map = database
    .prepare('select * from Maps where mapDescription = ?')
    .get(mapDescription)

  database.close()

  return map
}

function formatDateString(year: string, month: string, day: string): string {
  return (
    ('0000' + year).slice(-4) +
    '-' +
    ('00' + month).slice(-2) +
    '-' +
    ('00' + day).slice(-2)
  )
}

function formatTimeString(hour: string, minute: string): string {
  return ('00' + hour).slice(-2) + ':' + ('00' + minute).slice(-2)
}

const cemeteryToMapName = {
  '00': 'Crematorium',
  GC: 'New Greenwood - Columbarium',
  HC: 'Holy Sepulchre - Columbarium',
  HS: 'Holy Sepulchre',
  MA: 'Holy Sepulchre - Mausoleum',
  NG: 'New Greenwood',
  NW: 'Niche Wall',
  OG: 'Old Greenwood',
  PG: 'Pine Grove',
  UG: 'New Greenwood - Urn Garden',
  WK: 'West Korah'
}

const mapCache = new Map<string, recordTypes.Map>()

async function getMap(dataRow: { cemetery: string }): Promise<recordTypes.Map> {
  const mapCacheKey = dataRow.cemetery

  /*
    if (masterRow.CM_CEMETERY === "HS" &&
        (masterRow.CM_BLOCK === "F" || masterRow.CM_BLOCK === "G" || masterRow.CM_BLOCK === "H" || masterRow.CM_BLOCK === "J")) {
        mapCacheKey += "-" + masterRow.CM_BLOCK;
    }
    */

  if (mapCache.has(mapCacheKey)) {
    return mapCache.get(mapCacheKey)!
  }

  let map = getMapByMapDescription(mapCacheKey)

  if (!map) {
    console.log('Creating map: ' + dataRow.cemetery)

    const mapId = await addMap(
      {
        mapName: cemeteryToMapName[dataRow.cemetery] ?? dataRow.cemetery,
        mapDescription: dataRow.cemetery,
        mapSVG: '',
        mapLatitude: '',
        mapLongitude: '',
        mapAddress1: '',
        mapAddress2: '',
        mapCity: 'Sault Ste. Marie',
        mapProvince: 'ON',
        mapPostalCode: '',
        mapPhoneNumber: ''
      },
      user
    )

    map = await getMapFromDatabase(mapId) as recordTypes.Map
  }

  mapCache.set(mapCacheKey, map)

  return map
}

async function importFromMasterCSV(): Promise<void> {
  console.time('importFromMasterCSV')

  let masterRow: MasterRecord

  const rawData = fs.readFileSync('./temp/CMMASTER.csv').toString()

  const cmmaster: papa.ParseResult<MasterRecord> = papa.parse(rawData, {
    delimiter: ',',
    header: true,
    skipEmptyLines: true
  })

  for (const parseError of cmmaster.errors) {
    console.log(parseError)
  }

  try {
    for (masterRow of cmmaster.data) {
      const map = await getMap({
        cemetery: masterRow.CM_CEMETERY
      })!

      const lotName = importData.buildLotName({
        cemetery: masterRow.CM_CEMETERY,
        block: masterRow.CM_BLOCK,
        range1: masterRow.CM_RANGE1,
        range2: masterRow.CM_RANGE2,
        lot1: masterRow.CM_LOT1,
        lot2: masterRow.CM_LOT2,
        grave1: masterRow.CM_GRAVE1,
        grave2: masterRow.CM_GRAVE2,
        interment: masterRow.CM_INTERMENT
      })

      const lotTypeId = importIds.getLotTypeId({
        cemetery: masterRow.CM_CEMETERY
      })!

      let lotId: number

      if (masterRow.CM_CEMETERY !== '00') {
        lotId = await addLot(
          {
            lotName,
            lotTypeId,
            lotStatusId: importIds.availableLotStatusId,
            mapId: map.mapId!,
            mapKey: lotName.includes(',') ? lotName.split(',')[0] : lotName,
            lotLatitude: '',
            lotLongitude: ''
          },
          user
        )
      }

      let preneedOccupancyStartDateString: string
      let preneedLotOccupancyId: number

      if (masterRow.CM_PRENEED_OWNER !== '' || masterRow.CM_STATUS === 'P') {
        preneedOccupancyStartDateString = formatDateString(
          masterRow.CM_PURCHASE_YR,
          masterRow.CM_PURCHASE_MON,
          masterRow.CM_PURCHASE_DAY
        )

        let occupancyEndDateString = ''

        if (
          masterRow.CM_INTERMENT_YR !== '' &&
          masterRow.CM_INTERMENT_YR !== '0'
        ) {
          occupancyEndDateString = formatDateString(
            masterRow.CM_INTERMENT_YR,
            masterRow.CM_INTERMENT_MON,
            masterRow.CM_INTERMENT_DAY
          )
        }

        // if purchase date unavailable
        if (
          preneedOccupancyStartDateString === '0000-00-00' &&
          occupancyEndDateString !== ''
        ) {
          preneedOccupancyStartDateString = occupancyEndDateString
        }

        // if end date unavailable
        if (
          preneedOccupancyStartDateString === '0000-00-00' &&
          masterRow.CM_DEATH_YR !== '' &&
          masterRow.CM_DEATH_YR !== '0'
        ) {
          preneedOccupancyStartDateString = formatDateString(
            masterRow.CM_DEATH_YR,
            masterRow.CM_DEATH_MON,
            masterRow.CM_DEATH_DAY
          )

          // if death took place, and there's no preneed end date
          if (
            occupancyEndDateString === '0000-00-00' ||
            occupancyEndDateString === ''
          ) {
            occupancyEndDateString = preneedOccupancyStartDateString
          }
        }

        if (
          preneedOccupancyStartDateString === '' ||
          preneedOccupancyStartDateString === '0000-00-00'
        ) {
          preneedOccupancyStartDateString = '0001-01-01'
        }

        preneedLotOccupancyId = await addLotOccupancy(
          {
            occupancyTypeId: importIds.preneedOccupancyType.occupancyTypeId,
            lotId,
            occupancyStartDateString: preneedOccupancyStartDateString,
            occupancyEndDateString,
            occupancyTypeFieldIds: ''
          },
          user
        )

        const occupantPostalCode =
          `${masterRow.CM_POST1} ${masterRow.CM_POST2}`.trim()

        await addLotOccupancyOccupant(
          {
            lotOccupancyId: preneedLotOccupancyId,
            lotOccupantTypeId: importIds.preneedOwnerLotOccupantTypeId,
            occupantName: masterRow.CM_PRENEED_OWNER,
            occupantAddress1: masterRow.CM_ADDRESS,
            occupantAddress2: '',
            occupantCity: masterRow.CM_CITY,
            occupantProvince: masterRow.CM_PROV,
            occupantPostalCode,
            occupantPhoneNumber: '',
            occupantEmailAddress: ''
          },
          user
        )

        if (masterRow.CM_REMARK1 !== '') {
          await addLotOccupancyComment(
            {
              lotOccupancyId: preneedLotOccupancyId,
              lotOccupancyCommentDateString: preneedOccupancyStartDateString,
              lotOccupancyCommentTimeString: '00:00',
              lotOccupancyComment: masterRow.CM_REMARK1
            },
            user
          )
        }

        if (masterRow.CM_REMARK2 !== '') {
          await addLotOccupancyComment(
            {
              lotOccupancyId: preneedLotOccupancyId,
              lotOccupancyCommentDateString: preneedOccupancyStartDateString,
              lotOccupancyCommentTimeString: '00:00',
              lotOccupancyComment: masterRow.CM_REMARK2
            },
            user
          )
        }

        if (occupancyEndDateString === '') {
          await updateLotStatus(lotId, importIds.reservedLotStatusId, user)
        }
      }

      let deceasedOccupancyStartDateString: string
      let deceasedLotOccupancyId: number

      if (masterRow.CM_DECEASED_NAME !== '') {
        deceasedOccupancyStartDateString = formatDateString(
          masterRow.CM_INTERMENT_YR,
          masterRow.CM_INTERMENT_MON,
          masterRow.CM_INTERMENT_DAY
        )

        // if interment date unavailable
        if (
          deceasedOccupancyStartDateString === '0000-00-00' &&
          masterRow.CM_DEATH_YR !== '' &&
          masterRow.CM_DEATH_YR !== '0'
        ) {
          deceasedOccupancyStartDateString = formatDateString(
            masterRow.CM_DEATH_YR,
            masterRow.CM_DEATH_MON,
            masterRow.CM_DEATH_DAY
          )
        }

        if (
          deceasedOccupancyStartDateString === '' ||
          deceasedOccupancyStartDateString === '0000-00-00'
        ) {
          deceasedOccupancyStartDateString = '0001-01-01'
        }

        const deceasedOccupancyEndDateString = lotId
          ? ''
          : deceasedOccupancyStartDateString

        const occupancyType = lotId
          ? importIds.deceasedOccupancyType
          : importIds.cremationOccupancyType

        deceasedLotOccupancyId = await addLotOccupancy(
          {
            occupancyTypeId: occupancyType.occupancyTypeId,
            lotId,
            occupancyStartDateString: deceasedOccupancyStartDateString,
            occupancyEndDateString: deceasedOccupancyEndDateString,
            occupancyTypeFieldIds: ''
          },
          user
        )

        const deceasedPostalCode =
          `${masterRow.CM_POST1} ${masterRow.CM_POST2}`.trim()

        await addLotOccupancyOccupant(
          {
            lotOccupancyId: deceasedLotOccupancyId,
            lotOccupantTypeId: importIds.deceasedLotOccupantTypeId,
            occupantName: masterRow.CM_DECEASED_NAME,
            occupantAddress1: masterRow.CM_ADDRESS,
            occupantAddress2: '',
            occupantCity: masterRow.CM_CITY,
            occupantProvince: masterRow.CM_PROV,
            occupantPostalCode: deceasedPostalCode,
            occupantPhoneNumber: '',
            occupantEmailAddress: ''
          },
          user
        )

        if (masterRow.CM_DEATH_YR !== '') {
          const lotOccupancyFieldValue = formatDateString(
            masterRow.CM_DEATH_YR,
            masterRow.CM_DEATH_MON,
            masterRow.CM_DEATH_DAY
          )

          await addOrUpdateLotOccupancyField(
            {
              lotOccupancyId: deceasedLotOccupancyId,
              occupancyTypeFieldId: occupancyType.occupancyTypeFields!.find(
                (occupancyTypeField) => {
                  return occupancyTypeField.occupancyTypeField === 'Death Date'
                }
              )!.occupancyTypeFieldId!,
              lotOccupancyFieldValue
            },
            user
          )
        }

        if (masterRow.CM_AGE !== '') {
          await addOrUpdateLotOccupancyField(
            {
              lotOccupancyId: deceasedLotOccupancyId,
              occupancyTypeFieldId: occupancyType.occupancyTypeFields!.find(
                (occupancyTypeField) => {
                  return occupancyTypeField.occupancyTypeField === 'Death Age'
                }
              )!.occupancyTypeFieldId!,
              lotOccupancyFieldValue: masterRow.CM_AGE
            },
            user
          )
        }

        if (masterRow.CM_PERIOD !== '') {
          await addOrUpdateLotOccupancyField(
            {
              lotOccupancyId: deceasedLotOccupancyId,
              occupancyTypeFieldId: occupancyType.occupancyTypeFields!.find(
                (occupancyTypeField) => {
                  return (
                    occupancyTypeField.occupancyTypeField === 'Death Age Period'
                  )
                }
              )!.occupancyTypeFieldId!,
              lotOccupancyFieldValue: masterRow.CM_PERIOD
            },
            user
          )
        }

        if (masterRow.CM_FUNERAL_HOME !== '') {
          const funeralHomeOccupant =
            importData.getFuneralHomeLotOccupancyOccupantData(
              masterRow.CM_FUNERAL_HOME
            )

          await addLotOccupancyOccupant(
            {
              lotOccupancyId: deceasedLotOccupancyId,
              lotOccupantTypeId: funeralHomeOccupant.lotOccupantTypeId!,
              occupantName: funeralHomeOccupant.occupantName!,
              occupantAddress1: funeralHomeOccupant.occupantAddress1!,
              occupantAddress2: funeralHomeOccupant.occupantAddress2!,
              occupantCity: funeralHomeOccupant.occupantCity!,
              occupantProvince: funeralHomeOccupant.occupantProvince!,
              occupantPostalCode: funeralHomeOccupant.occupantPostalCode!,
              occupantPhoneNumber: funeralHomeOccupant.occupantPhoneNumber!,
              occupantEmailAddress: funeralHomeOccupant.occupantEmailAddress!
            },
            user
          )

          /*
            addOrUpdateLotOccupancyField(
              {
                  lotOccupancyId: deceasedLotOccupancyId,
                  occupancyTypeFieldId: allOccupancyTypeFields.find(
                      (occupancyTypeField) => {
                          return occupancyTypeField.occupancyTypeField === "Funeral Home";
                      }
                  ).occupancyTypeFieldId,
                  lotOccupancyFieldValue: masterRow.CM_FUNERAL_HOME
              },
              user
            );
          */
        }

        if (masterRow.CM_FUNERAL_YR !== '') {
          const lotOccupancyFieldValue = formatDateString(
            masterRow.CM_FUNERAL_YR,
            masterRow.CM_FUNERAL_MON,
            masterRow.CM_FUNERAL_DAY
          )

          await addOrUpdateLotOccupancyField(
            {
              lotOccupancyId: deceasedLotOccupancyId,
              occupancyTypeFieldId: occupancyType.occupancyTypeFields!.find(
                (occupancyTypeField) => {
                  return (
                    occupancyTypeField.occupancyTypeField === 'Funeral Date'
                  )
                }
              )!.occupancyTypeFieldId!,
              lotOccupancyFieldValue
            },
            user
          )
        }

        if (occupancyType.occupancyType !== 'Cremation') {
          if (masterRow.CM_CONTAINER_TYPE !== '') {
            await addOrUpdateLotOccupancyField(
              {
                lotOccupancyId: deceasedLotOccupancyId,
                occupancyTypeFieldId: occupancyType.occupancyTypeFields!.find(
                  (occupancyTypeField) => {
                    return (
                      occupancyTypeField.occupancyTypeField === 'Container Type'
                    )
                  }
                )!.occupancyTypeFieldId!,
                lotOccupancyFieldValue: masterRow.CM_CONTAINER_TYPE
              },
              user
            )
          }

          if (masterRow.CM_COMMITTAL_TYPE !== '') {
            let commitalType = masterRow.CM_COMMITTAL_TYPE

            if (commitalType === 'GS') {
              commitalType = 'Graveside'
            }

            await addOrUpdateLotOccupancyField(
              {
                lotOccupancyId: deceasedLotOccupancyId,
                occupancyTypeFieldId: occupancyType.occupancyTypeFields!.find(
                  (occupancyTypeField) => {
                    return (
                      occupancyTypeField.occupancyTypeField === 'Committal Type'
                    )
                  }
                )!.occupancyTypeFieldId!,
                lotOccupancyFieldValue: commitalType
              },
              user
            )
          }
        }

        if (masterRow.CM_REMARK1 !== '') {
          await addLotOccupancyComment(
            {
              lotOccupancyId: deceasedLotOccupancyId,
              lotOccupancyCommentDateString: deceasedOccupancyStartDateString,
              lotOccupancyCommentTimeString: '00:00',
              lotOccupancyComment: masterRow.CM_REMARK1
            },
            user
          )
        }

        if (masterRow.CM_REMARK2 !== '') {
          await addLotOccupancyComment(
            {
              lotOccupancyId: deceasedLotOccupancyId,
              lotOccupancyCommentDateString: deceasedOccupancyStartDateString,
              lotOccupancyCommentTimeString: '00:00',
              lotOccupancyComment: masterRow.CM_REMARK2
            },
            user
          )
        }

        await updateLotStatus(lotId, importIds.takenLotStatusId, user)

        if (masterRow.CM_PRENEED_OWNER !== '') {
          await addLotOccupancyOccupant(
            {
              lotOccupancyId: deceasedLotOccupancyId,
              lotOccupantTypeId: importIds.preneedOwnerLotOccupantTypeId,
              occupantName: masterRow.CM_PRENEED_OWNER,
              occupantAddress1: '',
              occupantAddress2: '',
              occupantCity: '',
              occupantProvince: '',
              occupantPostalCode: '',
              occupantPhoneNumber: '',
              occupantEmailAddress: ''
            },
            user
          )
        }
      }
    }
  } catch (error) {
    console.error(error)
    console.log(masterRow)
  }

  console.timeEnd('importFromMasterCSV')
}

async function importFromPrepaidCSV(): Promise<void> {
  console.time('importFromPrepaidCSV')

  let prepaidRow: PrepaidRecord

  const rawData = fs.readFileSync('./temp/CMPRPAID.csv').toString()

  const cmprpaid: papa.ParseResult<PrepaidRecord> = papa.parse(rawData, {
    delimiter: ',',
    header: true,
    skipEmptyLines: true
  })

  for (const parseError of cmprpaid.errors) {
    console.log(parseError)
  }

  try {
    for (prepaidRow of cmprpaid.data) {
      if (!prepaidRow.CMPP_PREPAID_FOR_NAME) {
        continue
      }

      let cemetery = prepaidRow.CMPP_CEMETERY

      if (cemetery === '.m') {
        cemetery = 'HC'
      }

      let lot: recordTypes.Lot

      if (cemetery !== '') {
        const map = await getMap({
          cemetery
        })

        const lotName = importData.buildLotName({
          cemetery,
          block: prepaidRow.CMPP_BLOCK,
          range1: prepaidRow.CMPP_RANGE1,
          range2: prepaidRow.CMPP_RANGE2,
          lot1: prepaidRow.CMPP_LOT1,
          lot2: prepaidRow.CMPP_LOT2,
          grave1: prepaidRow.CMPP_GRAVE1,
          grave2: prepaidRow.CMPP_GRAVE2,
          interment: prepaidRow.CMPP_INTERMENT
        })

        lot = await getLotByLotName(lotName)

        if (!lot) {
          const lotTypeId = importIds.getLotTypeId({
            cemetery
          })

          const lotId = await addLot(
            {
              lotName,
              lotTypeId,
              lotStatusId: importIds.reservedLotStatusId,
              mapId: map.mapId!,
              mapKey: lotName.includes(',') ? lotName.split(',')[0] : lotName,
              lotLatitude: '',
              lotLongitude: ''
            },
            user
          )

          lot = await getLot(lotId)
        }
      }

      if (lot && lot.lotStatusId === importIds.availableLotStatusId) {
        await updateLotStatus(lot.lotId, importIds.reservedLotStatusId, user)
      }

      const occupancyStartDateString = formatDateString(
        prepaidRow.CMPP_PURCH_YR,
        prepaidRow.CMPP_PURCH_MON,
        prepaidRow.CMPP_PURCH_DAY
      )

      let lotOccupancyId: number

      if (lot) {
        const possibleLotOccupancies = await getLotOccupancies(
          {
            lotId: lot.lotId,
            occupancyTypeId: importIds.preneedOccupancyType.occupancyTypeId,
            occupantName: prepaidRow.CMPP_PREPAID_FOR_NAME,
            occupancyStartDateString
          },
          {
            includeOccupants: false,
            limit: -1,
            offset: 0
          }
        )

        if (possibleLotOccupancies.lotOccupancies.length > 0) {
          lotOccupancyId =
            possibleLotOccupancies.lotOccupancies[0].lotOccupancyId!
        }
      }

      if (!lotOccupancyId) {
        lotOccupancyId = await addLotOccupancy(
          {
            lotId: lot ? lot.lotId : '',
            occupancyTypeId: importIds.preneedOccupancyType.occupancyTypeId,
            occupancyStartDateString,
            occupancyEndDateString: ''
          },
          user
        )
      }

      await addLotOccupancyOccupant(
        {
          lotOccupancyId,
          lotOccupantTypeId: importIds.preneedOwnerLotOccupantTypeId,
          occupantName: prepaidRow.CMPP_PREPAID_FOR_NAME,
          occupantAddress1: prepaidRow.CMPP_ADDRESS,
          occupantAddress2: '',
          occupantCity: prepaidRow.CMPP_CITY,
          occupantProvince: prepaidRow.CMPP_PROV.slice(0, 2),
          occupantPostalCode:
            prepaidRow.CMPP_POSTAL1 + ' ' + prepaidRow.CMPP_POSTAL2,
          occupantPhoneNumber: '',
          occupantEmailAddress: ''
        },
        user
      )

      if (prepaidRow.CMPP_ARRANGED_BY_NAME) {
        await addLotOccupancyOccupant(
          {
            lotOccupancyId,
            lotOccupantTypeId: importIds.purchaserLotOccupantTypeId,
            occupantName: prepaidRow.CMPP_ARRANGED_BY_NAME,
            occupantAddress1: '',
            occupantAddress2: '',
            occupantCity: '',
            occupantProvince: '',
            occupantPostalCode: '',
            occupantPhoneNumber: '',
            occupantEmailAddress: ''
          },
          user
        )
      }

      if (prepaidRow.CMPP_FEE_GRAV_SD !== '0.0') {
        await addLotOccupancyFee(
          {
            lotOccupancyId,
            feeId: importIds.getFeeIdByFeeDescription('CMPP_FEE_GRAV_SD'),
            quantity: 1,
            feeAmount: prepaidRow.CMPP_FEE_GRAV_SD,
            taxAmount: prepaidRow.CMPP_GST_GRAV_SD
          },
          user
        )
      }

      if (prepaidRow.CMPP_FEE_GRAV_DD !== '0.0') {
        await addLotOccupancyFee(
          {
            lotOccupancyId,
            feeId: importIds.getFeeIdByFeeDescription('CMPP_FEE_GRAV_DD'),
            quantity: 1,
            feeAmount: prepaidRow.CMPP_FEE_GRAV_DD,
            taxAmount: prepaidRow.CMPP_GST_GRAV_DD
          },
          user
        )
      }

      if (prepaidRow.CMPP_FEE_CHAP_SD !== '0.0') {
        await addLotOccupancyFee(
          {
            lotOccupancyId,
            feeId: importIds.getFeeIdByFeeDescription('CMPP_FEE_CHAP_SD'),
            quantity: 1,
            feeAmount: prepaidRow.CMPP_FEE_CHAP_SD,
            taxAmount: prepaidRow.CMPP_GST_CHAP_SD
          },
          user
        )
      }

      if (prepaidRow.CMPP_FEE_CHAP_DD !== '0.0') {
        await addLotOccupancyFee(
          {
            lotOccupancyId,
            feeId: importIds.getFeeIdByFeeDescription('CMPP_FEE_CHAP_DD'),
            quantity: 1,
            feeAmount: prepaidRow.CMPP_FEE_CHAP_DD,
            taxAmount: prepaidRow.CMPP_GST_CHAP_DD
          },
          user
        )
      }

      if (prepaidRow.CMPP_FEE_ENTOMBMENT !== '0.0') {
        await addLotOccupancyFee(
          {
            lotOccupancyId,
            feeId: importIds.getFeeIdByFeeDescription('CMPP_FEE_ENTOMBMENT'),
            quantity: 1,
            feeAmount: prepaidRow.CMPP_FEE_ENTOMBMENT,
            taxAmount: prepaidRow.CMPP_GST_ENTOMBMENT
          },
          user
        )
      }

      if (prepaidRow.CMPP_FEE_CREM !== '0.0') {
        await addLotOccupancyFee(
          {
            lotOccupancyId,
            feeId: importIds.getFeeIdByFeeDescription('CMPP_FEE_CREM'),
            quantity: 1,
            feeAmount: prepaidRow.CMPP_FEE_CREM,
            taxAmount: prepaidRow.CMPP_GST_CREM
          },
          user
        )
      }

      if (prepaidRow.CMPP_FEE_NICHE !== '0.0') {
        await addLotOccupancyFee(
          {
            lotOccupancyId,
            feeId: importIds.getFeeIdByFeeDescription('CMPP_FEE_NICHE'),
            quantity: 1,
            feeAmount: prepaidRow.CMPP_FEE_NICHE,
            taxAmount: prepaidRow.CMPP_GST_NICHE
          },
          user
        )
      }

      if (
        prepaidRow.CMPP_FEE_DISINTERMENT !== '0.0' &&
        prepaidRow.CMPP_FEE_DISINTERMENT !== '20202.02'
      ) {
        await addLotOccupancyFee(
          {
            lotOccupancyId,
            feeId: importIds.getFeeIdByFeeDescription('CMPP_FEE_DISINTERMENT'),
            quantity: 1,
            feeAmount: prepaidRow.CMPP_FEE_DISINTERMENT,
            taxAmount: prepaidRow.CMPP_GST_DISINTERMENT
          },
          user
        )
      }

      const transactionAmount =
        Number.parseFloat(prepaidRow.CMPP_FEE_GRAV_SD) +
        Number.parseFloat(prepaidRow.CMPP_GST_GRAV_SD) +
        Number.parseFloat(prepaidRow.CMPP_FEE_GRAV_DD) +
        Number.parseFloat(prepaidRow.CMPP_GST_GRAV_DD) +
        Number.parseFloat(prepaidRow.CMPP_FEE_CHAP_SD) +
        Number.parseFloat(prepaidRow.CMPP_GST_CHAP_SD) +
        Number.parseFloat(prepaidRow.CMPP_FEE_CHAP_DD) +
        Number.parseFloat(prepaidRow.CMPP_GST_CHAP_DD) +
        Number.parseFloat(prepaidRow.CMPP_FEE_ENTOMBMENT) +
        Number.parseFloat(prepaidRow.CMPP_GST_ENTOMBMENT) +
        Number.parseFloat(prepaidRow.CMPP_FEE_CREM) +
        Number.parseFloat(prepaidRow.CMPP_GST_CREM) +
        Number.parseFloat(prepaidRow.CMPP_FEE_NICHE) +
        Number.parseFloat(prepaidRow.CMPP_GST_NICHE) +
        Number.parseFloat(
          prepaidRow.CMPP_FEE_DISINTERMENT === '20202.02'
            ? '0'
            : prepaidRow.CMPP_FEE_DISINTERMENT
        ) +
        Number.parseFloat(
          prepaidRow.CMPP_GST_DISINTERMENT === '20202.02'
            ? '0'
            : prepaidRow.CMPP_GST_DISINTERMENT
        )

      await addLotOccupancyTransaction(
        {
          lotOccupancyId,
          externalReceiptNumber: '',
          transactionAmount,
          transactionDateString: occupancyStartDateString,
          transactionNote: 'Order Number: ' + prepaidRow.CMPP_ORDER_NO
        },
        user
      )

      if (prepaidRow.CMPP_REMARK1) {
        await addLotOccupancyComment(
          {
            lotOccupancyId,
            lotOccupancyCommentDateString: occupancyStartDateString,
            lotOccupancyComment: prepaidRow.CMPP_REMARK1
          },
          user
        )
      }

      if (prepaidRow.CMPP_REMARK2) {
        await addLotOccupancyComment(
          {
            lotOccupancyId,
            lotOccupancyCommentDateString: occupancyStartDateString,
            lotOccupancyComment: prepaidRow.CMPP_REMARK2
          },
          user
        )
      }
    }
  } catch (error) {
    console.error(error)
    console.log(prepaidRow)
  }

  console.timeEnd('importFromPrepaidCSV')
}

async function importFromWorkOrderCSV(): Promise<void> {
  console.time('importFromWorkOrderCSV')

  let workOrderRow: WorkOrderRecord

  const rawData = fs.readFileSync('./temp/CMWKORDR.csv').toString()

  const cmwkordr: papa.ParseResult<WorkOrderRecord> = papa.parse(rawData, {
    delimiter: ',',
    header: true,
    skipEmptyLines: true
  })

  for (const parseError of cmwkordr.errors) {
    console.log(parseError)
  }

  const currentDateString = dateToString(new Date())

  try {
    for (workOrderRow of cmwkordr.data) {
      const workOrderNumber = ('000000' + workOrderRow.WO_WORK_ORDER).slice(-6)

      let workOrder = await getWorkOrderByWorkOrderNumber(workOrderNumber)

      const workOrderOpenDateString = dateIntegerToString(
        Number.parseInt(workOrderRow.WO_INITIATION_DATE, 10)
      )

      if (workOrder) {
        if (workOrder.workOrderCloseDate) {
          await reopenWorkOrder(workOrder.workOrderId!, user)
          delete workOrder.workOrderCloseDate
          delete workOrder.workOrderCloseDateString
        }
      } else {
        const workOrderId = await addWorkOrder(
          {
            workOrderNumber,
            workOrderTypeId: importIds.workOrderTypeId,
            workOrderDescription: (
              workOrderRow.WO_REMARK1 +
              ' ' +
              workOrderRow.WO_REMARK2 +
              ' ' +
              workOrderRow.WO_REMARK3
            ).trim(),
            workOrderOpenDateString
          },
          user
        )

        workOrder = await getWorkOrder(workOrderId, {
          includeLotsAndLotOccupancies: true,
          includeComments: true,
          includeMilestones: true
        })
      }

      let lot: recordTypes.Lot

      if (workOrderRow.WO_CEMETERY !== '00') {
        const lotName = importData.buildLotName({
          cemetery: workOrderRow.WO_CEMETERY,
          block: workOrderRow.WO_BLOCK,
          range1: workOrderRow.WO_RANGE1,
          range2: workOrderRow.WO_RANGE2,
          lot1: workOrderRow.WO_LOT1,
          lot2: workOrderRow.WO_LOT2,
          grave1: workOrderRow.WO_GRAVE1,
          grave2: workOrderRow.WO_GRAVE2,
          interment: workOrderRow.WO_INTERMENT
        })

        lot = await getLotByLotName(lotName)

        if (!lot) {
          const map = await getMap({ cemetery: workOrderRow.WO_CEMETERY })

          const lotTypeId = importIds.getLotTypeId({
            cemetery: workOrderRow.WO_CEMETERY
          })

          const lotId = await addLot(
            {
              mapId: map.mapId!,
              lotName,
              mapKey: lotName.includes(',') ? lotName.split(',')[0] : lotName,
              lotStatusId: importIds.takenLotStatusId,
              lotTypeId,
              lotLatitude: '',
              lotLongitude: ''
            },
            user
          )

          lot = await getLot(lotId)
        } else {
          await updateLotStatus(lot.lotId, importIds.takenLotStatusId, user)
        }

        const workOrderContainsLot = workOrder.workOrderLots!.find(
          (possibleLot) => {
            return (possibleLot.lotId = lot.lotId)
          }
        )

        if (!workOrderContainsLot) {
          await addWorkOrderLot(
            {
              workOrderId: workOrder.workOrderId!,
              lotId: lot.lotId
            },
            user
          )

          workOrder.workOrderLots!.push(lot)
        }
      }

      let occupancyStartDateString = workOrderOpenDateString

      if (workOrderRow.WO_INTERMENT_YR) {
        occupancyStartDateString = formatDateString(
          workOrderRow.WO_INTERMENT_YR,
          workOrderRow.WO_INTERMENT_MON,
          workOrderRow.WO_INTERMENT_DAY
        )
      }

      const occupancyType = lot
        ? importIds.deceasedOccupancyType
        : importIds.cremationOccupancyType

      const lotOccupancyId = await addLotOccupancy(
        {
          lotId: lot ? lot.lotId : '',
          occupancyTypeId: occupancyType.occupancyTypeId,
          occupancyStartDateString,
          occupancyEndDateString: ''
        },
        user
      )

      await addLotOccupancyOccupant(
        {
          lotOccupancyId,
          lotOccupantTypeId: importIds.deceasedLotOccupantTypeId,
          occupantName: workOrderRow.WO_DECEASED_NAME,
          occupantAddress1: workOrderRow.WO_ADDRESS,
          occupantAddress2: '',
          occupantCity: workOrderRow.WO_CITY,
          occupantProvince: workOrderRow.WO_PROV.slice(0, 2),
          occupantPostalCode:
            workOrderRow.WO_POST1 + ' ' + workOrderRow.WO_POST2,
          occupantPhoneNumber: '',
          occupantEmailAddress: ''
        },
        user
      )

      if (workOrderRow.WO_DEATH_YR !== '') {
        const lotOccupancyFieldValue = formatDateString(
          workOrderRow.WO_DEATH_YR,
          workOrderRow.WO_DEATH_MON,
          workOrderRow.WO_DEATH_DAY
        )

        await addOrUpdateLotOccupancyField(
          {
            lotOccupancyId,
            occupancyTypeFieldId: occupancyType.occupancyTypeFields!.find(
              (occupancyTypeField) => {
                return occupancyTypeField.occupancyTypeField === 'Death Date'
              }
            )!.occupancyTypeFieldId!,
            lotOccupancyFieldValue
          },
          user
        )
      }

      if (workOrderRow.WO_DEATH_PLACE !== '') {
        await addOrUpdateLotOccupancyField(
          {
            lotOccupancyId,
            occupancyTypeFieldId: occupancyType.occupancyTypeFields!.find(
              (occupancyTypeField) => {
                return occupancyTypeField.occupancyTypeField === 'Death Place'
              }
            )!.occupancyTypeFieldId!,
            lotOccupancyFieldValue: workOrderRow.WO_DEATH_PLACE
          },
          user
        )
      }

      if (workOrderRow.WO_AGE !== '') {
        await addOrUpdateLotOccupancyField(
          {
            lotOccupancyId,
            occupancyTypeFieldId: occupancyType.occupancyTypeFields!.find(
              (occupancyTypeField) => {
                return occupancyTypeField.occupancyTypeField === 'Death Age'
              }
            )!.occupancyTypeFieldId!,
            lotOccupancyFieldValue: workOrderRow.WO_AGE
          },
          user
        )
      }

      if (workOrderRow.WO_PERIOD !== '') {
        await addOrUpdateLotOccupancyField(
          {
            lotOccupancyId,
            occupancyTypeFieldId: occupancyType.occupancyTypeFields!.find(
              (occupancyTypeField) => {
                return (
                  occupancyTypeField.occupancyTypeField === 'Death Age Period'
                )
              }
            )!.occupancyTypeFieldId!,
            lotOccupancyFieldValue: workOrderRow.WO_PERIOD
          },
          user
        )
      }

      if (workOrderRow.WO_FUNERAL_HOME !== '') {
        const funeralHomeOccupant =
          importData.getFuneralHomeLotOccupancyOccupantData(
            workOrderRow.WO_FUNERAL_HOME
          )

        await addLotOccupancyOccupant(
          {
            lotOccupancyId,
            lotOccupantTypeId: funeralHomeOccupant.lotOccupantTypeId!,
            occupantName: funeralHomeOccupant.occupantName!,
            occupantAddress1: funeralHomeOccupant.occupantAddress1!,
            occupantAddress2: funeralHomeOccupant.occupantAddress2!,
            occupantCity: funeralHomeOccupant.occupantCity!,
            occupantProvince: funeralHomeOccupant.occupantProvince!,
            occupantPostalCode: funeralHomeOccupant.occupantPostalCode!,
            occupantPhoneNumber: funeralHomeOccupant.occupantPhoneNumber!,
            occupantEmailAddress: funeralHomeOccupant.occupantEmailAddress!
          },
          user
        )

        /*
          addOrUpdateLotOccupancyField(
            {
                lotOccupancyId: lotOccupancyId,
                occupancyTypeFieldId: allOccupancyTypeFields.find((occupancyTypeField) => {
                    return occupancyTypeField.occupancyTypeField === "Funeral Home";
                }).occupancyTypeFieldId,
                lotOccupancyFieldValue: workOrderRow.WO_FUNERAL_HOME
            },
            user
          );
        */
      }

      if (workOrderRow.WO_FUNERAL_YR !== '') {
        const lotOccupancyFieldValue = formatDateString(
          workOrderRow.WO_FUNERAL_YR,
          workOrderRow.WO_FUNERAL_MON,
          workOrderRow.WO_FUNERAL_DAY
        )

        await addOrUpdateLotOccupancyField(
          {
            lotOccupancyId,
            occupancyTypeFieldId: occupancyType.occupancyTypeFields!.find(
              (occupancyTypeField) => {
                return occupancyTypeField.occupancyTypeField === 'Funeral Date'
              }
            )!.occupancyTypeFieldId!,
            lotOccupancyFieldValue
          },
          user
        )
      }

      if (occupancyType.occupancyType !== 'Cremation') {
        if (workOrderRow.WO_CONTAINER_TYPE !== '') {
          await addOrUpdateLotOccupancyField(
            {
              lotOccupancyId,
              occupancyTypeFieldId: occupancyType.occupancyTypeFields!.find(
                (occupancyTypeField) => {
                  return (
                    occupancyTypeField.occupancyTypeField === 'Container Type'
                  )
                }
              )!.occupancyTypeFieldId!,
              lotOccupancyFieldValue: workOrderRow.WO_CONTAINER_TYPE
            },
            user
          )
        }

        if (workOrderRow.WO_COMMITTAL_TYPE !== '') {
          let commitalType = workOrderRow.WO_COMMITTAL_TYPE

          if (commitalType === 'GS') {
            commitalType = 'Graveside'
          }

          await addOrUpdateLotOccupancyField(
            {
              lotOccupancyId,
              occupancyTypeFieldId: occupancyType.occupancyTypeFields!.find(
                (occupancyTypeField) => {
                  return (
                    occupancyTypeField.occupancyTypeField === 'Committal Type'
                  )
                }
              )!.occupancyTypeFieldId!,
              lotOccupancyFieldValue: commitalType
            },
            user
          )
        }
      }

      await addWorkOrderLotOccupancy(
        {
          workOrderId: workOrder.workOrderId!,
          lotOccupancyId
        },
        user
      )

      // Milestones

      let hasIncompleteMilestones = !workOrderRow.WO_CONFIRMATION_IN
      let maxMilestoneCompletionDateString = workOrderOpenDateString

      if (importIds.acknowledgedWorkOrderMilestoneTypeId) {
        await addWorkOrderMilestone(
          {
            workOrderId: workOrder.workOrderId,
            workOrderMilestoneTypeId:
              importIds.acknowledgedWorkOrderMilestoneTypeId,
            workOrderMilestoneDateString: workOrderOpenDateString,
            workOrderMilestoneDescription: '',
            workOrderMilestoneCompletionDateString:
              workOrderRow.WO_CONFIRMATION_IN
                ? workOrderOpenDateString
                : undefined,
            workOrderMilestoneCompletionTimeString:
              workOrderRow.WO_CONFIRMATION_IN ? '00:00' : undefined
          },
          user
        )
      }

      if (workOrderRow.WO_DEATH_YR) {
        const workOrderMilestoneDateString = formatDateString(
          workOrderRow.WO_DEATH_YR,
          workOrderRow.WO_DEATH_MON,
          workOrderRow.WO_DEATH_DAY
        )

        if (importIds.deathWorkOrderMilestoneTypeId) {
          await addWorkOrderMilestone(
            {
              workOrderId: workOrder.workOrderId!,
              workOrderMilestoneTypeId: importIds.deathWorkOrderMilestoneTypeId,
              workOrderMilestoneDateString,
              workOrderMilestoneDescription:
                'Death Place: ' + workOrderRow.WO_DEATH_PLACE,
              workOrderMilestoneCompletionDateString:
                workOrderMilestoneDateString < currentDateString
                  ? workOrderMilestoneDateString
                  : undefined,
              workOrderMilestoneCompletionTimeString:
                workOrderMilestoneDateString < currentDateString
                  ? '00:00'
                  : undefined
            },
            user
          )
        }

        if (workOrderMilestoneDateString > maxMilestoneCompletionDateString) {
          maxMilestoneCompletionDateString = workOrderMilestoneDateString
        }

        if (workOrderMilestoneDateString >= currentDateString) {
          hasIncompleteMilestones = true
        }
      }

      if (workOrderRow.WO_FUNERAL_YR) {
        const workOrderMilestoneDateString = formatDateString(
          workOrderRow.WO_FUNERAL_YR,
          workOrderRow.WO_FUNERAL_MON,
          workOrderRow.WO_FUNERAL_DAY
        )

        let funeralHour = Number.parseInt(workOrderRow.WO_FUNERAL_HR, 10)
        if (funeralHour <= 6) {
          funeralHour += 12
        }

        const workOrderMilestoneTimeString = formatTimeString(
          funeralHour.toString(),
          workOrderRow.WO_FUNERAL_MIN
        )

        if (importIds.funeralWorkOrderMilestoneTypeId) {
          await addWorkOrderMilestone(
            {
              workOrderId: workOrder.workOrderId!,
              workOrderMilestoneTypeId:
                importIds.funeralWorkOrderMilestoneTypeId,
              workOrderMilestoneDateString,
              workOrderMilestoneTimeString,
              workOrderMilestoneDescription:
                'Funeral Home: ' + workOrderRow.WO_FUNERAL_HOME,
              workOrderMilestoneCompletionDateString:
                workOrderMilestoneDateString < currentDateString
                  ? workOrderMilestoneDateString
                  : undefined,
              workOrderMilestoneCompletionTimeString:
                workOrderMilestoneDateString < currentDateString
                  ? workOrderMilestoneTimeString
                  : undefined
            },
            user
          )
        }

        if (workOrderMilestoneDateString > maxMilestoneCompletionDateString) {
          maxMilestoneCompletionDateString = workOrderMilestoneDateString
        }

        if (workOrderMilestoneDateString >= currentDateString) {
          hasIncompleteMilestones = true
        }
      }

      if (
        workOrderRow.WO_CREMATION === 'Y' &&
        importIds.cremationWorkOrderMilestoneTypeId
      ) {
        await addWorkOrderMilestone(
          {
            workOrderId: workOrder.workOrderId!,
            workOrderMilestoneTypeId:
              importIds.cremationWorkOrderMilestoneTypeId,
            workOrderMilestoneDateString: maxMilestoneCompletionDateString,
            workOrderMilestoneDescription: '',
            workOrderMilestoneCompletionDateString:
              maxMilestoneCompletionDateString < currentDateString
                ? maxMilestoneCompletionDateString
                : undefined,
            workOrderMilestoneCompletionTimeString:
              maxMilestoneCompletionDateString < currentDateString
                ? '00:00'
                : undefined
          },
          user
        )
      }

      if (workOrderRow.WO_INTERMENT_YR) {
        const workOrderMilestoneDateString = formatDateString(
          workOrderRow.WO_INTERMENT_YR,
          workOrderRow.WO_INTERMENT_MON,
          workOrderRow.WO_INTERMENT_DAY
        )

        if (importIds.intermentWorkOrderMilestoneTypeId) {
          await addWorkOrderMilestone(
            {
              workOrderId: workOrder.workOrderId!,
              workOrderMilestoneTypeId:
                importIds.intermentWorkOrderMilestoneTypeId,
              workOrderMilestoneDateString,
              workOrderMilestoneDescription: 'Depth: ' + workOrderRow.WO_DEPTH,
              workOrderMilestoneCompletionDateString:
                workOrderMilestoneDateString < currentDateString
                  ? workOrderMilestoneDateString
                  : undefined,
              workOrderMilestoneCompletionTimeString:
                workOrderMilestoneDateString < currentDateString
                  ? '23:59'
                  : undefined
            },
            user
          )
        }

        if (workOrderMilestoneDateString > maxMilestoneCompletionDateString) {
          maxMilestoneCompletionDateString = workOrderMilestoneDateString
        }

        if (workOrderMilestoneDateString >= currentDateString) {
          hasIncompleteMilestones = true
        }
      }

      if (!hasIncompleteMilestones) {
        await closeWorkOrder(
          {
            workOrderId: workOrder.workOrderId!,
            workOrderCloseDateString: maxMilestoneCompletionDateString
          },
          user
        )
      }
    }
  } catch (error) {
    console.error(error)
    console.log(workOrderRow)
  }

  console.timeEnd('importFromWorkOrderCSV')
}

console.log('Started ' + new Date().toLocaleString())
console.time('importFromCsv')

purgeTables()
// purgeConfigTables();
await importFromMasterCSV()
await importFromPrepaidCSV()
await importFromWorkOrderCSV()

console.timeEnd('importFromCsv')
console.log('Finished ' + new Date().toLocaleString())
