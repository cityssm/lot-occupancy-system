import type { Request, Response } from 'express'

export function handler(_request: Request, response: Response): void {
  response.render('admin-cleanup', {
    headTitle: 'Database Cleanup'
  })
}

export default handler
