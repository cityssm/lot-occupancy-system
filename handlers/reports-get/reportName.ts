import type { RequestHandler } from 'express'

import {
  getReportData,
  ReportParameters
} from '../../helpers/lotOccupancyDB/getReportData.js'

import papaparse from 'papaparse'

export const handler: RequestHandler = (request, response) => {
  const reportName = request.params.reportName

  let rows: unknown[] | undefined

  switch (reportName) {
    default: {
      rows = getReportData(reportName, request.query as ReportParameters)
      break
    }
  }

  if (!rows) {
    return response.status(404).json({
      success: false,
      message: 'Report Not Found'
    })
  }

  const csv = papaparse.unparse(rows)

  response.setHeader(
    'Content-Disposition',
    'attachment; filename=' + reportName + '-' + Date.now().toString() + '.csv'
  )

  response.setHeader('Content-Type', 'text/csv')

  response.send(csv)
}

export default handler
