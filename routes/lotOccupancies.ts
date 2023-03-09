import { type RequestHandler, Router } from 'express'

import handler_search from '../handlers/lotOccupancies-get/search.js'
import handler_doSearchLotOccupancies from '../handlers/lotOccupancies-post/doSearchLotOccupancies.js'

import handler_view from '../handlers/lotOccupancies-get/view.js'

import handler_new from '../handlers/lotOccupancies-get/new.js'
import handler_doGetOccupancyTypeFields from '../handlers/lotOccupancies-post/doGetOccupancyTypeFields.js'
import handler_doCreateLotOccupancy from '../handlers/lotOccupancies-post/doCreateLotOccupancy.js'

import handler_edit from '../handlers/lotOccupancies-get/edit.js'
import handler_doUpdateLotOccupancy from '../handlers/lotOccupancies-post/doUpdateLotOccupancy.js'
import handler_doCopyLotOccupancy from '../handlers/lotOccupancies-post/doCopyLotOccupancy.js'
import handler_doDeleteLotOccupancy from '../handlers/lotOccupancies-post/doDeleteLotOccupancy.js'

import handler_doSearchPastOccupants from '../handlers/lotOccupancies-post/doSearchPastOccupants.js'
import handler_doAddLotOccupancyOccupant from '../handlers/lotOccupancies-post/doAddLotOccupancyOccupant.js'
import handler_doUpdateLotOccupancyOccupant from '../handlers/lotOccupancies-post/doUpdateLotOccupancyOccupant.js'
import handler_doDeleteLotOccupancyOccupant from '../handlers/lotOccupancies-post/doDeleteLotOccupancyOccupant.js'

import handler_doAddLotOccupancyComment from '../handlers/lotOccupancies-post/doAddLotOccupancyComment.js'
import handler_doUpdateLotOccupancyComment from '../handlers/lotOccupancies-post/doUpdateLotOccupancyComment.js'
import handler_doDeleteLotOccupancyComment from '../handlers/lotOccupancies-post/doDeleteLotOccupancyComment.js'

import handler_doGetFees from '../handlers/lotOccupancies-post/doGetFees.js'
import handler_doAddLotOccupancyFee from '../handlers/lotOccupancies-post/doAddLotOccupancyFee.js'
import handler_doUpdateLotOccupancyFeeQuantity from '../handlers/lotOccupancies-post/doUpdateLotOccupancyFeeQuantity.js'
import handler_doDeleteLotOccupancyFee from '../handlers/lotOccupancies-post/doDeleteLotOccupancyFee.js'

import handler_doGetDynamicsGPDocument from '../handlers/lotOccupancies-post/doGetDynamicsGPDocument.js'
import handler_doAddLotOccupancyTransaction from '../handlers/lotOccupancies-post/doAddLotOccupancyTransaction.js'
import handler_doDeleteLotOccupancyTransaction from '../handlers/lotOccupancies-post/doDeleteLotOccupancyTransaction.js'

import * as permissionHandlers from '../handlers/permissions.js'

import * as configFunctions from '../helpers/functions.config.js'

export const router = Router()

// Search

router.get('/', handler_search as RequestHandler)

router.post(
  '/doSearchLotOccupancies',
  handler_doSearchLotOccupancies as RequestHandler
)

// Create

router.get(
  '/new',
  permissionHandlers.updateGetHandler,
  handler_new as RequestHandler
)

router.post(
  '/doGetOccupancyTypeFields',
  permissionHandlers.updatePostHandler,
  handler_doGetOccupancyTypeFields as RequestHandler
)

router.post(
  '/doCreateLotOccupancy',
  permissionHandlers.updatePostHandler,
  handler_doCreateLotOccupancy as RequestHandler
)

// View

router.get('/:lotOccupancyId', handler_view as RequestHandler)

// Edit

router.get(
  '/:lotOccupancyId/edit',
  permissionHandlers.updateGetHandler,
  handler_edit as RequestHandler
)

router.post(
  '/doUpdateLotOccupancy',
  permissionHandlers.updatePostHandler,
  handler_doUpdateLotOccupancy as RequestHandler
)

router.post(
  '/doCopyLotOccupancy',
  permissionHandlers.updatePostHandler,
  handler_doCopyLotOccupancy as RequestHandler
)

router.post(
  '/doDeleteLotOccupancy',
  permissionHandlers.updatePostHandler,
  handler_doDeleteLotOccupancy as RequestHandler
)

// Occupants

router.post(
  '/doSearchPastOccupants',
  permissionHandlers.updatePostHandler,
  handler_doSearchPastOccupants as RequestHandler
)

router.post(
  '/doAddLotOccupancyOccupant',
  permissionHandlers.updatePostHandler,
  handler_doAddLotOccupancyOccupant as RequestHandler
)

router.post(
  '/doUpdateLotOccupancyOccupant',
  permissionHandlers.updatePostHandler,
  handler_doUpdateLotOccupancyOccupant as RequestHandler
)

router.post(
  '/doDeleteLotOccupancyOccupant',
  permissionHandlers.updatePostHandler,
  handler_doDeleteLotOccupancyOccupant as RequestHandler
)

// Comments

router.post(
  '/doAddLotOccupancyComment',
  permissionHandlers.updatePostHandler,
  handler_doAddLotOccupancyComment as RequestHandler
)

router.post(
  '/doUpdateLotOccupancyComment',
  permissionHandlers.updatePostHandler,
  handler_doUpdateLotOccupancyComment as RequestHandler
)

router.post(
  '/doDeleteLotOccupancyComment',
  permissionHandlers.updatePostHandler,
  handler_doDeleteLotOccupancyComment as RequestHandler
)

// Fees

router.post(
  '/doGetFees',
  permissionHandlers.updatePostHandler,
  handler_doGetFees as RequestHandler
)

router.post(
  '/doAddLotOccupancyFee',
  permissionHandlers.updatePostHandler,
  handler_doAddLotOccupancyFee as RequestHandler
)

router.post(
  '/doUpdateLotOccupancyFeeQuantity',
  permissionHandlers.updatePostHandler,
  handler_doUpdateLotOccupancyFeeQuantity as RequestHandler
)

router.post(
  '/doDeleteLotOccupancyFee',
  permissionHandlers.updatePostHandler,
  handler_doDeleteLotOccupancyFee as RequestHandler
)

// Transactions

if (configFunctions.getProperty('settings.dynamicsGP.integrationIsEnabled')) {
  router.post(
    '/doGetDynamicsGPDocument',
    permissionHandlers.updatePostHandler,
    handler_doGetDynamicsGPDocument as RequestHandler
  )
}

router.post(
  '/doAddLotOccupancyTransaction',
  permissionHandlers.updatePostHandler,
  handler_doAddLotOccupancyTransaction as RequestHandler
)

router.post(
  '/doDeleteLotOccupancyTransaction',
  permissionHandlers.updatePostHandler,
  handler_doDeleteLotOccupancyTransaction as RequestHandler
)

export default router
