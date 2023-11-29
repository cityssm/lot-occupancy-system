import { type RequestHandler, Router } from 'express'

import handler_pdf from '../handlers/print-get/pdf.js'
import handler_screen from '../handlers/print-get/screen.js'

export const router = Router()

router.get('/screen/:printName', handler_screen as RequestHandler)

router.get('/pdf/:printName', handler_pdf as RequestHandler)

export default router
