import type { Request, Response } from 'express'

import * as configFunctions from '../../helpers/functions.config.js'
import {
  getReportData,
  getScreenPrintConfig
} from '../../helpers/functions.print.js'

export async function handler(
  request: Request,
  response: Response
): Promise<void> {
  const printName = request.params.printName

  if (
    !configFunctions
      .getConfigProperty('settings.lotOccupancy.prints')
      .includes(`screen/${printName}`) &&
    !configFunctions
      .getConfigProperty('settings.workOrders.prints')
      .includes(`screen/${printName}`)
  ) {
    response.redirect(
      `${configFunctions.getConfigProperty(
        'reverseProxy.urlPrefix'
      )}/dashboard/?error=printConfigNotAllowed`
    )
    return
  }

  const printConfig = getScreenPrintConfig(printName)

  if (printConfig === undefined) {
    response.redirect(
      configFunctions.getConfigProperty('reverseProxy.urlPrefix') +
        '/dashboard/?error=printConfigNotFound'
    )
    return
  }

  const reportData = await getReportData(printConfig, request.query)

  response.render(`print/screen/${printName}`, reportData)
}

export default handler
