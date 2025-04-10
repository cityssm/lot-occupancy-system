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
import { updateGetHandler, updatePostHandler } from '../handlers/permissions.js'

export const router = Router()

router.get('/', handler_search)

router.get('/new', updateGetHandler, handler_new)

router.get('/:mapId', handler_view)

router.get('/:mapId/next', handler_next)

router.get('/:mapId/previous', handler_previous)

router.get('/:mapId/edit', updateGetHandler, handler_edit)

router.post(
  '/doCreateMap',
  updatePostHandler,
  handler_doCreateMap
)

router.post(
  '/doUpdateMap',
  updatePostHandler,
  handler_doUpdateMap
)

router.post(
  '/doDeleteMap',
  updatePostHandler,
  handler_doDeleteMap
)

export default router
