import { type RequestHandler, Router } from 'express'

import handler_edit from '../handlers/lots-get/edit.js'
import handler_new from '../handlers/lots-get/new.js'
import handler_next from '../handlers/lots-get/next.js'
import handler_previous from '../handlers/lots-get/previous.js'
import handler_search from '../handlers/lots-get/search.js'
import handler_view from '../handlers/lots-get/view.js'
import handler_doAddLotComment from '../handlers/lots-post/doAddLotComment.js'
import handler_doCreateLot from '../handlers/lots-post/doCreateLot.js'
import handler_doDeleteLot from '../handlers/lots-post/doDeleteLot.js'
import handler_doDeleteLotComment from '../handlers/lots-post/doDeleteLotComment.js'
import handler_doGetLotTypeFields from '../handlers/lots-post/doGetLotTypeFields.js'
import handler_doSearchLots from '../handlers/lots-post/doSearchLots.js'
import handler_doUpdateLot from '../handlers/lots-post/doUpdateLot.js'
import handler_doUpdateLotComment from '../handlers/lots-post/doUpdateLotComment.js'
import { updateGetHandler, updatePostHandler } from '../handlers/permissions.js'

export const router = Router()

/*
 * Lot Search
 */

router.get('/', handler_search as RequestHandler)

router.post('/doSearchLots', handler_doSearchLots as RequestHandler)

/*
 * Lot View / Edit
 */

router.get('/new', updateGetHandler, handler_new as RequestHandler)

router.get('/:lotId', handler_view as RequestHandler)

router.get('/:lotId/next', handler_next as RequestHandler)

router.get('/:lotId/previous', handler_previous as RequestHandler)

router.get('/:lotId/edit', updateGetHandler, handler_edit as RequestHandler)

router.post(
  '/doGetLotTypeFields',
  updatePostHandler,
  handler_doGetLotTypeFields as RequestHandler
)

router.post(
  '/doCreateLot',
  updatePostHandler,
  handler_doCreateLot as RequestHandler
)

router.post(
  '/doUpdateLot',
  updatePostHandler,
  handler_doUpdateLot as RequestHandler
)

router.post(
  '/doDeleteLot',
  updatePostHandler,
  handler_doDeleteLot as RequestHandler
)

router.post(
  '/doAddLotComment',
  updatePostHandler,
  handler_doAddLotComment as RequestHandler
)

router.post(
  '/doUpdateLotComment',
  updatePostHandler,
  handler_doUpdateLotComment as RequestHandler
)

router.post(
  '/doDeleteLotComment',
  updatePostHandler,
  handler_doDeleteLotComment as RequestHandler
)

export default router
