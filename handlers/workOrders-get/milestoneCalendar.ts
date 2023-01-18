import type { Request, Response } from 'express'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  response.render('workOrder-milestoneCalendar', {
    headTitle: 'Work Order Milestone Calendar'
  })
}

export default handler
