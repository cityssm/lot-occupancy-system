/* eslint-disable unicorn/filename-case, @eslint-community/eslint-comments/disable-enable-pair */

import {
  type DiamondCashReceipt,
  type DiamondExtendedGPInvoice,
  DynamicsGP,
  type GPInvoice
} from '@cityssm/dynamics-gp'

import type { DynamicsGPLookup } from '../types/configTypes.js'
import type { DynamicsGPDocument } from '../types/recordTypes.js'

import * as configFunctions from './functions.config.js'

let gp: DynamicsGP

if (configFunctions.getConfigProperty('settings.dynamicsGP.integrationIsEnabled')) {
  gp = new DynamicsGP(
    configFunctions.getConfigProperty('settings.dynamicsGP.mssqlConfig')
  )
}

function filterCashReceipt(
  cashReceipt: DiamondCashReceipt
): DiamondCashReceipt | undefined {
  const accountCodes = configFunctions.getConfigProperty(
    'settings.dynamicsGP.accountCodes'
  )

  if (accountCodes.length > 0) {
    for (const detail of cashReceipt.details) {
      if (accountCodes.includes(detail.accountCode)) {
        return cashReceipt
      }
    }

    for (const distribution of cashReceipt.distributions) {
      if (accountCodes.includes(distribution.accountCode)) {
        return cashReceipt
      }
    }

    return undefined
  }

  return cashReceipt
}

function filterInvoice(invoice: GPInvoice): GPInvoice | undefined {
  const itemNumbers = configFunctions.getConfigProperty(
    'settings.dynamicsGP.itemNumbers'
  )

  for (const itemNumber of itemNumbers) {
    const found = invoice.lineItems.some((itemRecord) => {
      return itemRecord.itemNumber === itemNumber
    })

    if (!found) {
      return undefined
    }
  }

  return invoice
}

function filterExtendedInvoice(
  invoice: DiamondExtendedGPInvoice
): DiamondExtendedGPInvoice | undefined {
  if (filterInvoice(invoice) === undefined) {
    return undefined
  }

  const trialBalanceCodes = configFunctions.getConfigProperty(
    'settings.dynamicsGP.trialBalanceCodes'
  )

  if (
    trialBalanceCodes.length > 0 &&
    trialBalanceCodes.includes(invoice.trialBalanceCode ?? '')
  ) {
    return invoice
  }

  return undefined
}

async function _getDynamicsGPDocument(
  documentNumber: string,
  lookupType: DynamicsGPLookup
): Promise<DynamicsGPDocument | undefined> {
  let document: DynamicsGPDocument | undefined

  switch (lookupType) {
    case 'invoice': {
      let invoice = await gp.getInvoiceByInvoiceNumber(documentNumber)

      if (invoice !== undefined) {
        invoice = filterInvoice(invoice)
      }

      if (invoice !== undefined) {
        document = {
          documentType: 'Invoice',
          documentNumber: invoice.invoiceNumber,
          documentDate: invoice.documentDate,
          documentDescription: [
            invoice.comment1,
            invoice.comment2,
            invoice.comment3,
            invoice.comment4
          ],
          documentTotal: invoice.documentAmount
        }
      }

      break
    }
    case 'diamond/cashReceipt': {
      let receipt: DiamondCashReceipt | undefined =
        await gp.getDiamondCashReceiptByDocumentNumber(documentNumber)

      if (receipt !== undefined) {
        receipt = filterCashReceipt(receipt)
      }

      if (receipt !== undefined) {
        document = {
          documentType: 'Cash Receipt',
          documentNumber: receipt.documentNumber.toString(),
          documentDate: receipt.documentDate,
          documentDescription: [
            receipt.description,
            receipt.description2,
            receipt.description3,
            receipt.description4,
            receipt.description5
          ],
          documentTotal: receipt.total
        }
      }

      break
    }
    case 'diamond/extendedInvoice': {
      let invoice = await gp.getDiamondExtendedInvoiceByInvoiceNumber(
        documentNumber
      )

      if (invoice !== undefined) {
        invoice = filterExtendedInvoice(invoice)
      }

      if (invoice !== undefined) {
        document = {
          documentType: 'Invoice',
          documentNumber: invoice.invoiceNumber,
          documentDate: invoice.documentDate,
          documentDescription: [
            invoice.comment1,
            invoice.comment2,
            invoice.comment3,
            invoice.comment4
          ],
          documentTotal: invoice.documentAmount
        }
      }

      break
    }
  }

  return document
}

export async function getDynamicsGPDocument(
  documentNumber: string
): Promise<DynamicsGPDocument | undefined> {
  if (
    !configFunctions.getConfigProperty('settings.dynamicsGP.integrationIsEnabled')
  ) {
    return undefined
  }

  let document: DynamicsGPDocument | undefined

  for (const lookupType of configFunctions.getConfigProperty(
    'settings.dynamicsGP.lookupOrder'
  )) {
    document = await _getDynamicsGPDocument(documentNumber, lookupType)

    if (document !== undefined) {
      break
    }
  }

  return document
}
