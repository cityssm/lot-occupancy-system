import { type RequestHandler, Router } from 'express'

import handler_database from '../handlers/admin-get/database.js'
import handler_fees from '../handlers/admin-get/fees.js'
import handler_lotTypes from '../handlers/admin-get/lotTypes.js'
import handler_ntfyStartup from '../handlers/admin-get/ntfyStartup.js'
import handler_occupancyTypes from '../handlers/admin-get/occupancyTypes.js'
import handler_tables from '../handlers/admin-get/tables.js'
import handler_doAddFee from '../handlers/admin-post/doAddFee.js'
import handler_doAddFeeCategory from '../handlers/admin-post/doAddFeeCategory.js'
import handler_doAddLotOccupantType from '../handlers/admin-post/doAddLotOccupantType.js'
import handler_doAddLotStatus from '../handlers/admin-post/doAddLotStatus.js'
import handler_doAddLotType from '../handlers/admin-post/doAddLotType.js'
import handler_doAddLotTypeField from '../handlers/admin-post/doAddLotTypeField.js'
import handler_doAddOccupancyType from '../handlers/admin-post/doAddOccupancyType.js'
import handler_doAddOccupancyTypeField from '../handlers/admin-post/doAddOccupancyTypeField.js'
import handler_doAddOccupancyTypePrint from '../handlers/admin-post/doAddOccupancyTypePrint.js'
import handler_doAddWorkOrderMilestoneType from '../handlers/admin-post/doAddWorkOrderMilestoneType.js'
import handler_doAddWorkOrderType from '../handlers/admin-post/doAddWorkOrderType.js'
import handler_doBackupDatabase from '../handlers/admin-post/doBackupDatabase.js'
import handler_doCleanupDatabase from '../handlers/admin-post/doCleanupDatabase.js'
import handler_doDeleteFee from '../handlers/admin-post/doDeleteFee.js'
import handler_doDeleteFeeCategory from '../handlers/admin-post/doDeleteFeeCategory.js'
import handler_doDeleteLotOccupantType from '../handlers/admin-post/doDeleteLotOccupantType.js'
import handler_doDeleteLotStatus from '../handlers/admin-post/doDeleteLotStatus.js'
import handler_doDeleteLotType from '../handlers/admin-post/doDeleteLotType.js'
import handler_doDeleteLotTypeField from '../handlers/admin-post/doDeleteLotTypeField.js'
import handler_doDeleteOccupancyType from '../handlers/admin-post/doDeleteOccupancyType.js'
import handler_doDeleteOccupancyTypeField from '../handlers/admin-post/doDeleteOccupancyTypeField.js'
import handler_doDeleteOccupancyTypePrint from '../handlers/admin-post/doDeleteOccupancyTypePrint.js'
import handler_doDeleteWorkOrderMilestoneType from '../handlers/admin-post/doDeleteWorkOrderMilestoneType.js'
import handler_doDeleteWorkOrderType from '../handlers/admin-post/doDeleteWorkOrderType.js'
import handler_doMoveFeeCategoryDown from '../handlers/admin-post/doMoveFeeCategoryDown.js'
import handler_doMoveFeeCategoryUp from '../handlers/admin-post/doMoveFeeCategoryUp.js'
import handler_doMoveFeeDown from '../handlers/admin-post/doMoveFeeDown.js'
import handler_doMoveFeeUp from '../handlers/admin-post/doMoveFeeUp.js'
import handler_doMoveLotOccupantTypeDown from '../handlers/admin-post/doMoveLotOccupantTypeDown.js'
import handler_doMoveLotOccupantTypeUp from '../handlers/admin-post/doMoveLotOccupantTypeUp.js'
import handler_doMoveLotStatusDown from '../handlers/admin-post/doMoveLotStatusDown.js'
import handler_doMoveLotStatusUp from '../handlers/admin-post/doMoveLotStatusUp.js'
import handler_doMoveLotTypeDown from '../handlers/admin-post/doMoveLotTypeDown.js'
import handler_doMoveLotTypeFieldDown from '../handlers/admin-post/doMoveLotTypeFieldDown.js'
import handler_doMoveLotTypeFieldUp from '../handlers/admin-post/doMoveLotTypeFieldUp.js'
import handler_doMoveLotTypeUp from '../handlers/admin-post/doMoveLotTypeUp.js'
import handler_doMoveOccupancyTypeDown from '../handlers/admin-post/doMoveOccupancyTypeDown.js'
import handler_doMoveOccupancyTypeFieldDown from '../handlers/admin-post/doMoveOccupancyTypeFieldDown.js'
import handler_doMoveOccupancyTypeFieldUp from '../handlers/admin-post/doMoveOccupancyTypeFieldUp.js'
import handler_doMoveOccupancyTypePrintDown from '../handlers/admin-post/doMoveOccupancyTypePrintDown.js'
import handler_doMoveOccupancyTypePrintUp from '../handlers/admin-post/doMoveOccupancyTypePrintUp.js'
import handler_doMoveOccupancyTypeUp from '../handlers/admin-post/doMoveOccupancyTypeUp.js'
import handler_doMoveWorkOrderMilestoneTypeDown from '../handlers/admin-post/doMoveWorkOrderMilestoneTypeDown.js'
import handler_doMoveWorkOrderMilestoneTypeUp from '../handlers/admin-post/doMoveWorkOrderMilestoneTypeUp.js'
import handler_doMoveWorkOrderTypeDown from '../handlers/admin-post/doMoveWorkOrderTypeDown.js'
import handler_doMoveWorkOrderTypeUp from '../handlers/admin-post/doMoveWorkOrderTypeUp.js'
import handler_doUpdateFee from '../handlers/admin-post/doUpdateFee.js'
import handler_doUpdateFeeCategory from '../handlers/admin-post/doUpdateFeeCategory.js'
import handler_doUpdateLotOccupantType from '../handlers/admin-post/doUpdateLotOccupantType.js'
import handler_doUpdateLotStatus from '../handlers/admin-post/doUpdateLotStatus.js'
import handler_doUpdateLotType from '../handlers/admin-post/doUpdateLotType.js'
import handler_doUpdateLotTypeField from '../handlers/admin-post/doUpdateLotTypeField.js'
import handler_doUpdateOccupancyType from '../handlers/admin-post/doUpdateOccupancyType.js'
import handler_doUpdateOccupancyTypeField from '../handlers/admin-post/doUpdateOccupancyTypeField.js'
import handler_doUpdateWorkOrderMilestoneType from '../handlers/admin-post/doUpdateWorkOrderMilestoneType.js'
import handler_doUpdateWorkOrderType from '../handlers/admin-post/doUpdateWorkOrderType.js'

// Ntfy Startup

export const router = Router()

/*
 * Fees
 */

router.get('/fees', handler_fees as RequestHandler)

router.post('/doAddFeeCategory', handler_doAddFeeCategory as RequestHandler)

router.post(
  '/doUpdateFeeCategory',
  handler_doUpdateFeeCategory as RequestHandler
)

router.post(
  '/doMoveFeeCategoryUp',
  handler_doMoveFeeCategoryUp as RequestHandler
)

router.post(
  '/doMoveFeeCategoryDown',
  handler_doMoveFeeCategoryDown as RequestHandler
)

router.post(
  '/doDeleteFeeCategory',
  handler_doDeleteFeeCategory as RequestHandler
)

router.post('/doAddFee', handler_doAddFee as RequestHandler)

router.post('/doUpdateFee', handler_doUpdateFee as RequestHandler)

router.post('/doMoveFeeUp', handler_doMoveFeeUp as RequestHandler)

router.post('/doMoveFeeDown', handler_doMoveFeeDown as RequestHandler)

router.post('/doDeleteFee', handler_doDeleteFee as RequestHandler)

/*
 * Occupancy Type Management
 */

router.get('/occupancyTypes', handler_occupancyTypes as RequestHandler)

router.post('/doAddOccupancyType', handler_doAddOccupancyType as RequestHandler)

router.post(
  '/doUpdateOccupancyType',
  handler_doUpdateOccupancyType as RequestHandler
)

router.post(
  '/doMoveOccupancyTypeUp',
  handler_doMoveOccupancyTypeUp as RequestHandler
)

router.post(
  '/doMoveOccupancyTypeDown',
  handler_doMoveOccupancyTypeDown as RequestHandler
)

router.post(
  '/doDeleteOccupancyType',
  handler_doDeleteOccupancyType as RequestHandler
)

// Occupancy Type Fields

router.post(
  '/doAddOccupancyTypeField',
  handler_doAddOccupancyTypeField as RequestHandler
)

router.post(
  '/doUpdateOccupancyTypeField',
  handler_doUpdateOccupancyTypeField as RequestHandler
)

router.post(
  '/doMoveOccupancyTypeFieldUp',
  handler_doMoveOccupancyTypeFieldUp as RequestHandler
)

router.post(
  '/doMoveOccupancyTypeFieldDown',
  handler_doMoveOccupancyTypeFieldDown as RequestHandler
)

router.post(
  '/doDeleteOccupancyTypeField',
  handler_doDeleteOccupancyTypeField as RequestHandler
)

// Occupancy Type Prints

router.post(
  '/doAddOccupancyTypePrint',
  handler_doAddOccupancyTypePrint as RequestHandler
)

router.post(
  '/doMoveOccupancyTypePrintUp',
  handler_doMoveOccupancyTypePrintUp as RequestHandler
)

router.post(
  '/doMoveOccupancyTypePrintDown',
  handler_doMoveOccupancyTypePrintDown as RequestHandler
)

router.post(
  '/doDeleteOccupancyTypePrint',
  handler_doDeleteOccupancyTypePrint as RequestHandler
)

/*
 * Lot Type Management
 */

router.get('/lotTypes', handler_lotTypes as RequestHandler)

router.post('/doAddLotType', handler_doAddLotType as RequestHandler)

router.post('/doUpdateLotType', handler_doUpdateLotType as RequestHandler)

router.post('/doMoveLotTypeUp', handler_doMoveLotTypeUp as RequestHandler)

router.post('/doMoveLotTypeDown', handler_doMoveLotTypeDown as RequestHandler)

router.post('/doDeleteLotType', handler_doDeleteLotType as RequestHandler)

// Lot Type Fields

router.post('/doAddLotTypeField', handler_doAddLotTypeField as RequestHandler)

router.post(
  '/doUpdateLotTypeField',
  handler_doUpdateLotTypeField as RequestHandler
)

router.post(
  '/doMoveLotTypeFieldUp',
  handler_doMoveLotTypeFieldUp as RequestHandler
)

router.post(
  '/doMoveLotTypeFieldDown',
  handler_doMoveLotTypeFieldDown as RequestHandler
)

router.post(
  '/doDeleteLotTypeField',
  handler_doDeleteLotTypeField as RequestHandler
)

/*
 * Config Tables
 */

router.get('/tables', handler_tables as RequestHandler)

// Config Tables - Work Order Types

router.post('/doAddWorkOrderType', handler_doAddWorkOrderType as RequestHandler)

router.post(
  '/doUpdateWorkOrderType',
  handler_doUpdateWorkOrderType as RequestHandler
)

router.post(
  '/doMoveWorkOrderTypeUp',
  handler_doMoveWorkOrderTypeUp as RequestHandler
)

router.post(
  '/doMoveWorkOrderTypeDown',
  handler_doMoveWorkOrderTypeDown as RequestHandler
)

router.post(
  '/doDeleteWorkOrderType',
  handler_doDeleteWorkOrderType as RequestHandler
)
// Config Tables - Work Order Milestone Types

router.post(
  '/doAddWorkOrderMilestoneType',

  handler_doAddWorkOrderMilestoneType as RequestHandler
)

router.post(
  '/doUpdateWorkOrderMilestoneType',
  handler_doUpdateWorkOrderMilestoneType as RequestHandler
)

router.post(
  '/doMoveWorkOrderMilestoneTypeUp',
  handler_doMoveWorkOrderMilestoneTypeUp as RequestHandler
)

router.post(
  '/doMoveWorkOrderMilestoneTypeDown',
  handler_doMoveWorkOrderMilestoneTypeDown as RequestHandler
)

router.post(
  '/doDeleteWorkOrderMilestoneType',
  handler_doDeleteWorkOrderMilestoneType as RequestHandler
)

// Config Tables - Lot Statuses

router.post('/doAddLotStatus', handler_doAddLotStatus as RequestHandler)

router.post('/doUpdateLotStatus', handler_doUpdateLotStatus as RequestHandler)

router.post('/doMoveLotStatusUp', handler_doMoveLotStatusUp as RequestHandler)

router.post(
  '/doMoveLotStatusDown',
  handler_doMoveLotStatusDown as RequestHandler
)

router.post('/doDeleteLotStatus', handler_doDeleteLotStatus as RequestHandler)

// Config Tables - Lot Occupant Types

router.post(
  '/doAddLotOccupantType',
  handler_doAddLotOccupantType as RequestHandler
)

router.post(
  '/doUpdateLotOccupantType',
  handler_doUpdateLotOccupantType as RequestHandler
)

router.post(
  '/doMoveLotOccupantTypeUp',
  handler_doMoveLotOccupantTypeUp as RequestHandler
)

router.post(
  '/doMoveLotOccupantTypeDown',
  handler_doMoveLotOccupantTypeDown as RequestHandler
)

router.post(
  '/doDeleteLotOccupantType',
  handler_doDeleteLotOccupantType as RequestHandler
)

// Database Maintenance

router.get('/database', handler_database)

router.post('/doBackupDatabase', handler_doBackupDatabase as RequestHandler)

router.post('/doCleanupDatabase', handler_doCleanupDatabase as RequestHandler)

// Ntfy Startup

router.get('/ntfyStartup', handler_ntfyStartup)

export default router
