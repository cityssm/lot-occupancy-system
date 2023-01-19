import { Router, RequestHandler } from 'express'

import handler_milestoneICS from '../handlers/api-get/milestoneICS.js'

export const router = Router()

router.get('/milestoneICS', handler_milestoneICS as RequestHandler)

export default router
