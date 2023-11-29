import { type RequestHandler, Router } from 'express'

import * as permissionHandlers from '../handlers/permissions.js'
import handler_edit from '../handlers/workOrders-get/edit.js'
import handler_milestoneCalendar from '../handlers/workOrders-get/milestoneCalendar.js'
import handler_new from '../handlers/workOrders-get/new.js'
import handler_outlook from '../handlers/workOrders-get/outlook.js'
import handler_search from '../handlers/workOrders-get/search.js'
import handler_view from '../handlers/workOrders-get/view.js'
import handler_doAddWorkOrderComment from '../handlers/workOrders-post/doAddWorkOrderComment.js'
import handler_doAddWorkOrderLot from '../handlers/workOrders-post/doAddWorkOrderLot.js'
import handler_doAddWorkOrderLotOccupancy from '../handlers/workOrders-post/doAddWorkOrderLotOccupancy.js'
import handler_doAddWorkOrderMilestone from '../handlers/workOrders-post/doAddWorkOrderMilestone.js'
import handler_doCloseWorkOrder from '../handlers/workOrders-post/doCloseWorkOrder.js'
import handler_doCompleteWorkOrderMilestone from '../handlers/workOrders-post/doCompleteWorkOrderMilestone.js'
import handler_doCreateWorkOrder from '../handlers/workOrders-post/doCreateWorkOrder.js'
import handler_doDeleteWorkOrder from '../handlers/workOrders-post/doDeleteWorkOrder.js'
import handler_doDeleteWorkOrderComment from '../handlers/workOrders-post/doDeleteWorkOrderComment.js'
import handler_doDeleteWorkOrderLot from '../handlers/workOrders-post/doDeleteWorkOrderLot.js'
import handler_doDeleteWorkOrderLotOccupancy from '../handlers/workOrders-post/doDeleteWorkOrderLotOccupancy.js'
import handler_doDeleteWorkOrderMilestone from '../handlers/workOrders-post/doDeleteWorkOrderMilestone.js'
import handler_doGetWorkOrderMilestones from '../handlers/workOrders-post/doGetWorkOrderMilestones.js'
import handler_doReopenWorkOrder from '../handlers/workOrders-post/doReopenWorkOrder.js'
import handler_doReopenWorkOrderMilestone from '../handlers/workOrders-post/doReopenWorkOrderMilestone.js'
import handler_doSearchWorkOrders from '../handlers/workOrders-post/doSearchWorkOrders.js'
import handler_doUpdateLotStatus from '../handlers/workOrders-post/doUpdateLotStatus.js'
import handler_doUpdateWorkOrder from '../handlers/workOrders-post/doUpdateWorkOrder.js'
import handler_doUpdateWorkOrderComment from '../handlers/workOrders-post/doUpdateWorkOrderComment.js'
import handler_doUpdateWorkOrderMilestone from '../handlers/workOrders-post/doUpdateWorkOrderMilestone.js'

export const router = Router()

// Search

router.get('/', handler_search as RequestHandler)

router.post('/doSearchWorkOrders', handler_doSearchWorkOrders as RequestHandler)

// Milestone Calendar

router.get('/milestoneCalendar', handler_milestoneCalendar as RequestHandler)

router.post(
  '/doGetWorkOrderMilestones',
  handler_doGetWorkOrderMilestones as RequestHandler
)

// Outlook Integration

router.get('/outlook', handler_outlook as RequestHandler)

// New

router.get(
  '/new',
  permissionHandlers.updateGetHandler,
  handler_new as RequestHandler
)

router.post(
  '/doCreateWorkOrder',
  permissionHandlers.updatePostHandler,
  handler_doCreateWorkOrder as RequestHandler
)

// View

router.get('/:workOrderId', handler_view as RequestHandler)

router.post(
  '/doReopenWorkOrder',
  permissionHandlers.updatePostHandler,
  handler_doReopenWorkOrder as RequestHandler
)

// Edit

router.get(
  '/:workOrderId/edit',
  permissionHandlers.updateGetHandler,
  handler_edit as RequestHandler
)

router.post(
  '/doUpdateWorkOrder',
  permissionHandlers.updatePostHandler,
  handler_doUpdateWorkOrder as RequestHandler
)

router.post(
  '/doCloseWorkOrder',
  permissionHandlers.updatePostHandler,
  handler_doCloseWorkOrder as RequestHandler
)

router.post(
  '/doDeleteWorkOrder',
  permissionHandlers.updatePostHandler,
  handler_doDeleteWorkOrder as RequestHandler
)

// Lot Occupancy

router.post(
  '/doAddWorkOrderLotOccupancy',
  permissionHandlers.updatePostHandler,
  handler_doAddWorkOrderLotOccupancy as RequestHandler
)

router.post(
  '/doDeleteWorkOrderLotOccupancy',
  permissionHandlers.updatePostHandler,
  handler_doDeleteWorkOrderLotOccupancy as RequestHandler
)

router.post(
  '/doAddWorkOrderLot',
  permissionHandlers.updatePostHandler,
  handler_doAddWorkOrderLot as RequestHandler
)

router.post(
  '/doUpdateLotStatus',
  permissionHandlers.updatePostHandler,
  handler_doUpdateLotStatus as RequestHandler
)

router.post(
  '/doDeleteWorkOrderLot',
  permissionHandlers.updatePostHandler,
  handler_doDeleteWorkOrderLot as RequestHandler
)

// Comments

router.post(
  '/doAddWorkOrderComment',
  permissionHandlers.updatePostHandler,
  handler_doAddWorkOrderComment as RequestHandler
)

router.post(
  '/doUpdateWorkOrderComment',
  permissionHandlers.updatePostHandler,
  handler_doUpdateWorkOrderComment as RequestHandler
)

router.post(
  '/doDeleteWorkOrderComment',
  permissionHandlers.updatePostHandler,
  handler_doDeleteWorkOrderComment as RequestHandler
)

// Milestones

router.post(
  '/doAddWorkOrderMilestone',
  permissionHandlers.updatePostHandler,
  handler_doAddWorkOrderMilestone as RequestHandler
)

router.post(
  '/doUpdateWorkOrderMilestone',
  permissionHandlers.updatePostHandler,
  handler_doUpdateWorkOrderMilestone as RequestHandler
)

router.post(
  '/doCompleteWorkOrderMilestone',
  permissionHandlers.updatePostHandler,
  handler_doCompleteWorkOrderMilestone as RequestHandler
)

router.post(
  '/doReopenWorkOrderMilestone',
  permissionHandlers.updatePostHandler,
  handler_doReopenWorkOrderMilestone as RequestHandler
)

router.post(
  '/doDeleteWorkOrderMilestone',
  permissionHandlers.updatePostHandler,
  handler_doDeleteWorkOrderMilestone as RequestHandler
)

export default router
