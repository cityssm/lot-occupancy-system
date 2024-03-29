import { type RequestHandler, Router } from 'express'

import handler_edit from '../handlers/maps-get/edit.js'
import handler_new from '../handlers/maps-get/new.js'
import handler_next from '../handlers/maps-get/next.js'
import handler_previous from '../handlers/maps-get/previous.js'
import handler_search from '../handlers/maps-get/search.js'
import handler_view from '../handlers/maps-get/view.js'
import handler_doCreateMap from '../handlers/maps-post/doCreateMap.js'
import handler_doDeleteMap from '../handlers/maps-post/doDeleteMap.js'
import handler_doUpdateMap from '../handlers/maps-post/doUpdateMap.js'
import * as permissionHandlers from '../handlers/permissions.js'

export const router = Router()

router.get('/', handler_search as RequestHandler)

router.get(
  '/new',
  permissionHandlers.updateGetHandler,
  handler_new as RequestHandler
)

router.get('/:mapId', handler_view as RequestHandler)

router.get('/:mapId/next', handler_next as RequestHandler)

router.get('/:mapId/previous', handler_previous as RequestHandler)

router.get(
  '/:mapId/edit',
  permissionHandlers.updateGetHandler,
  handler_edit as RequestHandler
)

router.post(
  '/doCreateMap',
  permissionHandlers.updatePostHandler,
  handler_doCreateMap as RequestHandler
)

router.post(
  '/doUpdateMap',
  permissionHandlers.updatePostHandler,
  handler_doUpdateMap as RequestHandler
)

router.post(
  '/doDeleteMap',
  permissionHandlers.updatePostHandler,
  handler_doDeleteMap as RequestHandler
)

export default router
