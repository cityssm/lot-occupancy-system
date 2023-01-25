import type { Request, Response } from 'express'

export function handler(_request: Request, response: Response): void {
  response.render('admin-database', {
    headTitle: 'Database Maintenance'
  })
}

export default handler
