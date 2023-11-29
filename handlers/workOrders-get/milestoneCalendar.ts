import type { Request, Response } from 'express'

export function handler(request: Request, response: Response): void {
  response.render('workOrder-milestoneCalendar', {
    headTitle: 'Work Order Milestone Calendar'
  })
}

export default handler
