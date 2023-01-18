import * as configFunctions from './functions.config.js'

import { getLot } from './lotOccupancyDB/getLot.js'
import { getLotOccupancy } from './lotOccupancyDB/getLotOccupancy.js'
import { getWorkOrder } from './lotOccupancyDB/getWorkOrder.js'

interface PrintConfig {
  title: string
  params: string[]
}

const screenPrintConfigs: Record<string, PrintConfig> = {
  lotOccupancy: {
    title: `${configFunctions.getProperty(
      'aliases.lot'
    )} ${configFunctions.getProperty('aliases.occupancy')} Print`,
    params: ['lotOccupancyId']
  }
}

export function getScreenPrintConfig(printName: string): PrintConfig {
  return screenPrintConfigs[printName]
}

const pdfPrintConfigs: Record<string, PrintConfig> = {
  workOrder: {
    title: 'Work Order Field Sheet',
    params: ['workOrderId']
  },
  'workOrder-commentLog': {
    title: 'Work Order Field Sheet - Comment Log',
    params: ['workOrderId']
  },

  // Occupancy
  'ssm.cemetery.burialPermit': {
    title: 'Burial Permit',
    params: ['lotOccupancyId']
  },
  'ssm.cemetery.contract': {
    title: 'Contract for Purchase of Interment Rights',
    params: ['lotOccupancyId']
  }
}

export function getPdfPrintConfig(printName: string): PrintConfig {
  return pdfPrintConfigs[printName]
}

export function getPrintConfig(
  screenOrPdfPrintName: string
): PrintConfig | undefined {
  const printNameSplit = screenOrPdfPrintName.split('/')

  switch (printNameSplit[0]) {
    case 'screen': {
      return getScreenPrintConfig(printNameSplit[1])
    }
    case 'pdf': {
      return getPdfPrintConfig(printNameSplit[1])
    }
  }

  return undefined
}

export async function getReportData(
  printConfig: PrintConfig,
  requestQuery: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const reportData: Record<string, unknown> = {
    headTitle: printConfig.title
  }

  if (
    printConfig.params.includes('lotOccupancyId') &&
    typeof requestQuery.lotOccupancyId === 'string'
  ) {
    const lotOccupancy = await getLotOccupancy(requestQuery.lotOccupancyId)

    if (lotOccupancy?.lotId) {
      reportData.lot = getLot(lotOccupancy.lotId)
    }

    reportData.lotOccupancy = lotOccupancy
  }

  if (
    printConfig.params.includes('workOrderId') &&
    typeof requestQuery.workOrderId === 'string'
  ) {
    reportData.workOrder = getWorkOrder(requestQuery.workOrderId, {
      includeLotsAndLotOccupancies: true,
      includeComments: true,
      includeMilestones: true
    })
  }

  return reportData
}
