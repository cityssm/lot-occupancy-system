import { Router } from 'express'

import { updateGetHandler, updatePostHandler } from '../handlers/permissions.js'
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

router.get('/', handler_search)

router.post('/doSearchWorkOrders', handler_doSearchWorkOrders)

// Milestone Calendar

router.get('/milestoneCalendar', handler_milestoneCalendar)

router.post('/doGetWorkOrderMilestones', handler_doGetWorkOrderMilestones)

// Outlook Integration

router.get('/outlook', handler_outlook)

// New

router.get('/new', updateGetHandler, handler_new)

router.post('/doCreateWorkOrder', updatePostHandler, handler_doCreateWorkOrder)

// View

router.get('/:workOrderId', handler_view)

router.post('/doReopenWorkOrder', updatePostHandler, handler_doReopenWorkOrder)

// Edit

router.get('/:workOrderId/edit', updateGetHandler, handler_edit)

router.post('/doUpdateWorkOrder', updatePostHandler, handler_doUpdateWorkOrder)

router.post('/doCloseWorkOrder', updatePostHandler, handler_doCloseWorkOrder)

router.post('/doDeleteWorkOrder', updatePostHandler, handler_doDeleteWorkOrder)

// Lot Occupancy

router.post(
  '/doAddWorkOrderLotOccupancy',
  updatePostHandler,
  handler_doAddWorkOrderLotOccupancy
)

router.post(
  '/doDeleteWorkOrderLotOccupancy',
  updatePostHandler,
  handler_doDeleteWorkOrderLotOccupancy
)

router.post('/doAddWorkOrderLot', updatePostHandler, handler_doAddWorkOrderLot)

router.post('/doUpdateLotStatus', updatePostHandler, handler_doUpdateLotStatus)

router.post(
  '/doDeleteWorkOrderLot',
  updatePostHandler,
  handler_doDeleteWorkOrderLot
)

// Comments

router.post(
  '/doAddWorkOrderComment',
  updatePostHandler,
  handler_doAddWorkOrderComment
)

router.post(
  '/doUpdateWorkOrderComment',
  updatePostHandler,
  handler_doUpdateWorkOrderComment
)

router.post(
  '/doDeleteWorkOrderComment',
  updatePostHandler,
  handler_doDeleteWorkOrderComment
)

// Milestones

router.post(
  '/doAddWorkOrderMilestone',
  updatePostHandler,
  handler_doAddWorkOrderMilestone
)

router.post(
  '/doUpdateWorkOrderMilestone',
  updatePostHandler,
  handler_doUpdateWorkOrderMilestone
)

router.post(
  '/doCompleteWorkOrderMilestone',
  updatePostHandler,
  handler_doCompleteWorkOrderMilestone
)

router.post(
  '/doReopenWorkOrderMilestone',
  updatePostHandler,
  handler_doReopenWorkOrderMilestone
)

router.post(
  '/doDeleteWorkOrderMilestone',
  updatePostHandler,
  handler_doDeleteWorkOrderMilestone
)

export default router
