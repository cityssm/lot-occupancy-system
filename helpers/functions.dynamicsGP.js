import * as gp from '@cityssm/dynamics-gp/gp.js';
import * as diamond from '@cityssm/dynamics-gp/diamond.js';
import * as configFunctions from './functions.config.js';
if (configFunctions.getProperty('settings.dynamicsGP.integrationIsEnabled')) {
    gp.setMSSQLConfig(configFunctions.getProperty('settings.dynamicsGP.mssqlConfig'));
    diamond.setMSSQLConfig(configFunctions.getProperty('settings.dynamicsGP.mssqlConfig'));
}
async function _getDynamicsGPDocument(documentNumber, lookupType) {
    let document;
    switch (lookupType) {
        case 'invoice': {
            const invoice = await gp.getInvoiceByInvoiceNumber(documentNumber);
            if (invoice) {
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
                };
            }
            break;
        }
        case 'diamond/cashReceipt': {
            const receipt = await diamond.getCashReceiptByDocumentNumber(documentNumber);
            if (receipt) {
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
                };
            }
        }
    }
    return document;
}
export async function getDynamicsGPDocument(documentNumber) {
    if (!configFunctions.getProperty('settings.dynamicsGP.integrationIsEnabled')) {
        return;
    }
    let document;
    for (const lookupType of configFunctions.getProperty('settings.dynamicsGP.lookupOrder')) {
        document = await _getDynamicsGPDocument(documentNumber, lookupType);
        if (document !== undefined) {
            break;
        }
    }
    return document;
}