import { type RequestHandler, Router } from 'express'

import handler_edit from '../handlers/lotOccupancies-get/edit.js'
import handler_new from '../handlers/lotOccupancies-get/new.js'
import handler_search from '../handlers/lotOccupancies-get/search.js'
import handler_view from '../handlers/lotOccupancies-get/view.js'
import handler_doAddLotOccupancyComment from '../handlers/lotOccupancies-post/doAddLotOccupancyComment.js'
import handler_doAddLotOccupancyFee from '../handlers/lotOccupancies-post/doAddLotOccupancyFee.js'
import handler_doAddLotOccupancyFeeCategory from '../handlers/lotOccupancies-post/doAddLotOccupancyFeeCategory.js'
import handler_doAddLotOccupancyOccupant from '../handlers/lotOccupancies-post/doAddLotOccupancyOccupant.js'
import handler_doAddLotOccupancyTransaction from '../handlers/lotOccupancies-post/doAddLotOccupancyTransaction.js'
import handler_doCopyLotOccupancy from '../handlers/lotOccupancies-post/doCopyLotOccupancy.js'
import handler_doCreateLotOccupancy from '../handlers/lotOccupancies-post/doCreateLotOccupancy.js'
import handler_doDeleteLotOccupancy from '../handlers/lotOccupancies-post/doDeleteLotOccupancy.js'
import handler_doDeleteLotOccupancyComment from '../handlers/lotOccupancies-post/doDeleteLotOccupancyComment.js'
import handler_doDeleteLotOccupancyFee from '../handlers/lotOccupancies-post/doDeleteLotOccupancyFee.js'
import handler_doDeleteLotOccupancyOccupant from '../handlers/lotOccupancies-post/doDeleteLotOccupancyOccupant.js'
import handler_doDeleteLotOccupancyTransaction from '../handlers/lotOccupancies-post/doDeleteLotOccupancyTransaction.js'
import handler_doGetDynamicsGPDocument from '../handlers/lotOccupancies-post/doGetDynamicsGPDocument.js'
import handler_doGetFees from '../handlers/lotOccupancies-post/doGetFees.js'
import handler_doGetOccupancyTypeFields from '../handlers/lotOccupancies-post/doGetOccupancyTypeFields.js'
import handler_doSearchLotOccupancies from '../handlers/lotOccupancies-post/doSearchLotOccupancies.js'
import handler_doSearchPastOccupants from '../handlers/lotOccupancies-post/doSearchPastOccupants.js'
import handler_doUpdateLotOccupancy from '../handlers/lotOccupancies-post/doUpdateLotOccupancy.js'
import handler_doUpdateLotOccupancyComment from '../handlers/lotOccupancies-post/doUpdateLotOccupancyComment.js'
import handler_doUpdateLotOccupancyFeeQuantity from '../handlers/lotOccupancies-post/doUpdateLotOccupancyFeeQuantity.js'
import handler_doUpdateLotOccupancyOccupant from '../handlers/lotOccupancies-post/doUpdateLotOccupancyOccupant.js'
import handler_doUpdateLotOccupancyTransaction from '../handlers/lotOccupancies-post/doUpdateLotOccupancyTransaction.js'
import { updateGetHandler, updatePostHandler } from '../handlers/permissions.js'
import { getConfigProperty } from '../helpers/functions.config.js'

export const router = Router()

// Search

router.get('/', handler_search as RequestHandler)

router.post(
  '/doSearchLotOccupancies',
  handler_doSearchLotOccupancies as RequestHandler
)

// Create

router.get('/new', updateGetHandler, handler_new as RequestHandler)

router.post(
  '/doGetOccupancyTypeFields',
  updatePostHandler,
  handler_doGetOccupancyTypeFields as RequestHandler
)

router.post(
  '/doCreateLotOccupancy',
  updatePostHandler,
  handler_doCreateLotOccupancy as RequestHandler
)

// View

router.get('/:lotOccupancyId', handler_view as RequestHandler)

// Edit

router.get(
  '/:lotOccupancyId/edit',
  updateGetHandler,
  handler_edit as RequestHandler
)

router.post(
  '/doUpdateLotOccupancy',
  updatePostHandler,
  handler_doUpdateLotOccupancy as RequestHandler
)

router.post(
  '/doCopyLotOccupancy',
  updatePostHandler,
  handler_doCopyLotOccupancy as RequestHandler
)

router.post(
  '/doDeleteLotOccupancy',
  updatePostHandler,
  handler_doDeleteLotOccupancy as RequestHandler
)

// Occupants

router.post(
  '/doSearchPastOccupants',
  updatePostHandler,
  handler_doSearchPastOccupants as RequestHandler
)

router.post(
  '/doAddLotOccupancyOccupant',
  updatePostHandler,
  handler_doAddLotOccupancyOccupant as RequestHandler
)

router.post(
  '/doUpdateLotOccupancyOccupant',
  updatePostHandler,
  handler_doUpdateLotOccupancyOccupant as RequestHandler
)

router.post(
  '/doDeleteLotOccupancyOccupant',
  updatePostHandler,
  handler_doDeleteLotOccupancyOccupant as RequestHandler
)

// Comments

router.post(
  '/doAddLotOccupancyComment',
  updatePostHandler,
  handler_doAddLotOccupancyComment as RequestHandler
)

router.post(
  '/doUpdateLotOccupancyComment',
  updatePostHandler,
  handler_doUpdateLotOccupancyComment as RequestHandler
)

router.post(
  '/doDeleteLotOccupancyComment',
  updatePostHandler,
  handler_doDeleteLotOccupancyComment as RequestHandler
)

// Fees

router.post(
  '/doGetFees',
  updatePostHandler,
  handler_doGetFees as RequestHandler
)

router.post(
  '/doAddLotOccupancyFee',
  updatePostHandler,
  handler_doAddLotOccupancyFee as RequestHandler
)

router.post(
  '/doAddLotOccupancyFeeCategory',
  updatePostHandler,
  handler_doAddLotOccupancyFeeCategory as RequestHandler
)

router.post(
  '/doUpdateLotOccupancyFeeQuantity',
  updatePostHandler,
  handler_doUpdateLotOccupancyFeeQuantity as RequestHandler
)

router.post(
  '/doDeleteLotOccupancyFee',
  updatePostHandler,
  handler_doDeleteLotOccupancyFee as RequestHandler
)

// Transactions

if (getConfigProperty('settings.dynamicsGP.integrationIsEnabled')) {
  router.post(
    '/doGetDynamicsGPDocument',
    updatePostHandler,
    handler_doGetDynamicsGPDocument as RequestHandler
  )
}

router.post(
  '/doAddLotOccupancyTransaction',
  updatePostHandler,
  handler_doAddLotOccupancyTransaction as RequestHandler
)

router.post(
  '/doUpdateLotOccupancyTransaction',
  updatePostHandler,
  handler_doUpdateLotOccupancyTransaction as RequestHandler
)

router.post(
  '/doDeleteLotOccupancyTransaction',
  updatePostHandler,
  handler_doDeleteLotOccupancyTransaction as RequestHandler
)

export default router
