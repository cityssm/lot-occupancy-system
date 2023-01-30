import { lotOccupancyDB as databasePath } from '../data/databasePaths.js'

import { initializeDatabase } from './initializer.database.js'

import { addOccupancyTypeField } from './lotOccupancyDB/addOccupancyTypeField.js'

import { addLotOccupantType } from './lotOccupancyDB/addLotOccupantType.js'

import { addRecord } from './lotOccupancyDB/addRecord.js'

import type { PartialSession } from '../types/recordTypes.js'

import Debug from 'debug'
const debug = Debug('lot-occupancy-system:initialize')

const session: PartialSession = {
  user: {
    userName: 'init.cemetery',
    userProperties: {
      canUpdate: true,
      isAdmin: true,
      apiKey: ''
    }
  }
}

export async function initializeCemeteryDatabase(): Promise<boolean> {
  /*
   * Ensure database does not already exist
   */
  debug('Checking for ' + databasePath + '...')

  const databaseInitialized = initializeDatabase()

  if (!databaseInitialized) {
    debug(
      'Database already created.\n' +
        'To initialize this database with cemetery types, delete the database file first, then rerun this script.'
    )
    return false
  }

  debug('New database file created.  Proceeding with initialization.')

  /*
   * Lot Types
   */

  await addRecord('LotTypes', 'Casket Grave', 1, session)
  await addRecord('LotTypes', 'Columbarium', 2, session)
  await addRecord('LotTypes', 'Mausoleum', 2, session)
  await addRecord('LotTypes', 'Niche Wall', 2, session)
  await addRecord('LotTypes', 'Urn Garden', 2, session)
  await addRecord('LotTypes', 'Crematorium', 2, session)

  /*
   * Lot Statuses
   */

  await addRecord('LotStatuses', 'Available', 1, session)
  await addRecord('LotStatuses', 'Reserved', 2, session)
  await addRecord('LotStatuses', 'Taken', 3, session)

  /*
   * Lot Occupant Types
   */

  await addLotOccupantType(
    {
      lotOccupantType: 'Deceased',
      fontAwesomeIconClass: 'cross',
      orderNumber: 1
    },
    session
  )

  await addLotOccupantType(
    {
      lotOccupantType: 'Funeral Director',
      fontAwesomeIconClass: 'church',
      orderNumber: 2
    },
    session
  )

  await addLotOccupantType(
    {
      lotOccupantType: 'Preneed Owner',
      fontAwesomeIconClass: 'user',
      orderNumber: 3
    },
    session
  )

  await addLotOccupantType(
    {
      lotOccupantType: 'Purchaser',
      fontAwesomeIconClass: 'hand-holding-usd',
      occupantCommentTitle: 'Relationship to Owner/Deceased',
      orderNumber: 4
    },
    session
  )

  /*
   * Occupancy Types
   */

  await addRecord('OccupancyTypes', 'Preneed', 1, session)
  const intermentOccupancyTypeId = await addRecord(
    'OccupancyTypes',
    'Interment',
    2,
    session
  )
  const cremationOccupancyTypeId = await addRecord(
    'OccupancyTypes',
    'Cremation',
    3,
    session
  )

  // Death Date
  const deathDateField = {
    occupancyTypeId: intermentOccupancyTypeId,
    occupancyTypeField: 'Death Date',
    occupancyTypeFieldValues: '',
    pattern: '\\d{4}([\\/-]\\d{2}){2}',
    isRequired: '',
    minimumLength: 10,
    maximumLength: 10,
    orderNumber: 1
  }

  await addOccupancyTypeField(deathDateField, session)

  await addOccupancyTypeField(
    Object.assign(deathDateField, {
      occupancyTypeId: cremationOccupancyTypeId
    }),
    session
  )

  // Death Age
  const deathAgeField = {
    occupancyTypeId: intermentOccupancyTypeId,
    occupancyTypeField: 'Death Age',
    occupancyTypeFieldValues: '',
    pattern: '\\d+',
    isRequired: '',
    minimumLength: 1,
    maximumLength: 3,
    orderNumber: 2
  }

  await addOccupancyTypeField(deathAgeField, session)

  await addOccupancyTypeField(
    Object.assign(deathAgeField, { occupancyTypeId: cremationOccupancyTypeId }),
    session
  )

  // Death Age Period
  const deathAgePeriod = {
    occupancyTypeId: intermentOccupancyTypeId,
    occupancyTypeField: 'Death Age Period',
    occupancyTypeFieldValues: 'Years\nMonths\nDays\nStillborn',
    pattern: '',
    isRequired: '',
    minimumLength: 1,
    maximumLength: 10,
    orderNumber: 3
  }

  await addOccupancyTypeField(deathAgePeriod, session)

  await addOccupancyTypeField(
    Object.assign(deathAgePeriod, {
      occupancyTypeId: cremationOccupancyTypeId
    }),
    session
  )

  // Death Place
  const deathPlace = {
    occupancyTypeId: intermentOccupancyTypeId,
    occupancyTypeField: 'Death Place',
    occupancyTypeFieldValues: '',
    pattern: '',
    isRequired: '',
    minimumLength: 1,
    maximumLength: 100,
    orderNumber: 4
  }

  await addOccupancyTypeField(deathPlace, session)

  await addOccupancyTypeField(
    Object.assign(deathPlace, { occupancyTypeId: cremationOccupancyTypeId }),
    session
  )

  // Funeral Home
  const funeralHome = {
    occupancyTypeId: intermentOccupancyTypeId,
    occupancyTypeField: 'Funeral Home',
    occupancyTypeFieldValues: '',
    pattern: '',
    isRequired: '',
    minimumLength: 1,
    maximumLength: 100,
    orderNumber: 10
  }

  await addOccupancyTypeField(funeralHome, session)

  await addOccupancyTypeField(
    Object.assign(funeralHome, { occupancyTypeId: cremationOccupancyTypeId }),
    session
  )

  // Funeral Date
  const funeralDate = {
    occupancyTypeId: intermentOccupancyTypeId,
    occupancyTypeField: 'Funeral Date',
    occupancyTypeFieldValues: '',
    pattern: '\\d{4}([\\/-]\\d{2}){2}',
    isRequired: '',
    minimumLength: 10,
    maximumLength: 10,
    orderNumber: 11
  }

  await addOccupancyTypeField(funeralDate, session)

  await addOccupancyTypeField(
    Object.assign(funeralDate, { occupancyTypeId: cremationOccupancyTypeId }),
    session
  )

  // Container Type
  const containerType = {
    occupancyTypeId: intermentOccupancyTypeId,
    occupancyTypeField: 'Container Type',
    occupancyTypeFieldValues: '',
    pattern: '',
    isRequired: '',
    minimumLength: 1,
    maximumLength: 100,
    orderNumber: 20
  }

  await addOccupancyTypeField(containerType, session)

  await addOccupancyTypeField(
    Object.assign(containerType, { occupancyTypeId: cremationOccupancyTypeId }),
    session
  )

  // Committal Type
  const committalType = {
    occupancyTypeId: intermentOccupancyTypeId,
    occupancyTypeField: 'Committal Type',
    occupancyTypeFieldValues: '',
    pattern: '',
    isRequired: '',
    minimumLength: 1,
    maximumLength: 100,
    orderNumber: 21
  }

  await addOccupancyTypeField(committalType, session)

  await addOccupancyTypeField(
    Object.assign(committalType, { occupancyTypeId: cremationOccupancyTypeId }),
    session
  )

  /*
   * Fee Categories
   */

  await addRecord('FeeCategories', 'Interment Rights', 1, session)
  await addRecord('FeeCategories', 'Cremation Services', 2, session)
  await addRecord('FeeCategories', 'Burial Charges', 3, session)
  await addRecord('FeeCategories', 'Disinterment of Human Remains', 4, session)
  await addRecord('FeeCategories', 'Additional Services', 5, session)

  /*
   * Work Orders
   */

  await addRecord('WorkOrderTypes', 'Cemetry Work Order', 1, session)

  await addRecord('WorkOrderMilestoneTypes', 'Funeral', 1, session)
  await addRecord('WorkOrderMilestoneTypes', 'Arrival', 2, session)
  await addRecord('WorkOrderMilestoneTypes', 'Cremation', 3, session)
  await addRecord('WorkOrderMilestoneTypes', 'Interment', 4, session)

  return true
}
