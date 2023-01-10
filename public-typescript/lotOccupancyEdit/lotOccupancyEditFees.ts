/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */

import type * as globalTypes from '../../types/globalTypes'
import type * as recordTypes from '../../types/recordTypes'

import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types'

import type { BulmaJS } from '@cityssm/bulma-js/types'

declare const cityssm: cityssmGlobal
declare const bulmaJS: BulmaJS

declare const los: globalTypes.LOS

declare const lotOccupancyId: string
declare const hasUnsavedChanges: boolean

let lotOccupancyFees: recordTypes.LotOccupancyFee[] = exports.lotOccupancyFees
delete exports.lotOccupancyFees

const lotOccupancyFeesContainerElement = document.querySelector(
  '#container--lotOccupancyFees'
) as HTMLElement

const getFeeGrandTotal = (): number => {
  let feeGrandTotal = 0

  for (const lotOccupancyFee of lotOccupancyFees) {
    feeGrandTotal +=
      (lotOccupancyFee.feeAmount! + lotOccupancyFee.taxAmount!) *
      lotOccupancyFee.quantity!
  }

  return feeGrandTotal
}

const deleteLotOccupancyFee = (clickEvent: Event) => {
  const feeId = (
    (clickEvent.currentTarget as HTMLElement).closest(
      '.container--lotOccupancyFee'
    ) as HTMLElement
  ).dataset.feeId

  const doDelete = () => {
    cityssm.postJSON(
      los.urlPrefix + '/lotOccupancies/doDeleteLotOccupancyFee',
      {
        lotOccupancyId,
        feeId
      },
      (responseJSON: {
        success: boolean
        errorMessage?: string
        lotOccupancyFees?: recordTypes.LotOccupancyFee[]
      }) => {
        if (responseJSON.success) {
          lotOccupancyFees = responseJSON.lotOccupancyFees!
          renderLotOccupancyFees()
        } else {
          bulmaJS.alert({
            title: 'Error Deleting Fee',
            message: responseJSON.errorMessage || '',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  bulmaJS.confirm({
    title: 'Delete Fee',
    message: 'Are you sure you want to delete this fee?',
    contextualColorName: 'warning',
    okButton: {
      text: 'Yes, Delete Fee',
      callbackFunction: doDelete
    }
  })
}

const renderLotOccupancyFees = () => {
  if (lotOccupancyFees.length === 0) {
    lotOccupancyFeesContainerElement.innerHTML =
      '<div class="message is-info">' +
      '<p class="message-body">There are no fees associated with this record.</p>' +
      '</div>'

    renderLotOccupancyTransactions()

    return
  }

  lotOccupancyFeesContainerElement.innerHTML =
    '<table class="table is-fullwidth is-striped is-hoverable">' +
    ('<thead><tr>' +
      '<th>Fee</th>' +
      '<th><span class="is-sr-only">Unit Cost</span></th>' +
      '<th class="has-width-1"><span class="is-sr-only">&times;</span></th>' +
      '<th class="has-width-1"><span class="is-sr-only">Quantity</span></th>' +
      '<th class="has-width-1"><span class="is-sr-only">equals</span></th>' +
      '<th class="has-width-1 has-text-right">Total</th>' +
      '<th class="has-width-1 is-hidden-print"><span class="is-sr-only">Options</span></th>' +
      '</tr></thead>') +
    '<tbody></tbody>' +
    ('<tfoot>' +
      '<tr><th colspan="5">Subtotal</th><td class="has-text-weight-bold has-text-right" id="lotOccupancyFees--feeAmountTotal"></td><td class="is-hidden-print"></td></tr>' +
      '<tr><th colspan="5">Tax</th><td class="has-text-right" id="lotOccupancyFees--taxAmountTotal"></td><td class="is-hidden-print"></td></tr>' +
      '<tr><th colspan="5">Grand Total</th><td class="has-text-weight-bold has-text-right" id="lotOccupancyFees--grandTotal"></td><td class="is-hidden-print"></td></tr>' +
      '</tfoot>') +
    '</table>'

  let feeAmountTotal = 0
  let taxAmountTotal = 0

  for (const lotOccupancyFee of lotOccupancyFees) {
    const tableRowElement = document.createElement('tr')
    tableRowElement.className = 'container--lotOccupancyFee'
    tableRowElement.dataset.feeId = lotOccupancyFee.feeId!.toString()
    tableRowElement.dataset.includeQuantity = lotOccupancyFee.includeQuantity
      ? '1'
      : '0'

    tableRowElement.innerHTML =
      '<td colspan="' +
      (lotOccupancyFee.quantity === 1 ? '5' : '1') +
      '">' +
      cityssm.escapeHTML(lotOccupancyFee.feeName || '') +
      '</td>' +
      (lotOccupancyFee.quantity === 1
        ? ''
        : '<td class="has-text-right">$' +
          lotOccupancyFee.feeAmount!.toFixed(2) +
          '</td>' +
          '<td>&times;</td>' +
          '<td class="has-text-right">' +
          lotOccupancyFee.quantity +
          '</td>' +
          '<td>=</td>') +
      '<td class="has-text-right">$' +
      (lotOccupancyFee.feeAmount! * lotOccupancyFee.quantity!).toFixed(2) +
      '</td>' +
      ('<td class="is-hidden-print">' +
        '<button class="button is-small is-danger is-light" data-tooltip="Delete Fee" type="button">' +
        '<i class="fas fa-trash" aria-hidden="true"></i>' +
        '</button>' +
        '</td>')

    tableRowElement
      .querySelector('button')!
      .addEventListener('click', deleteLotOccupancyFee)

    lotOccupancyFeesContainerElement
      .querySelector('tbody')!
      .append(tableRowElement)

    feeAmountTotal += lotOccupancyFee.feeAmount! * lotOccupancyFee.quantity!
    taxAmountTotal += lotOccupancyFee.taxAmount! * lotOccupancyFee.quantity!
  }

  ;(
    lotOccupancyFeesContainerElement.querySelector(
      '#lotOccupancyFees--feeAmountTotal'
    ) as HTMLElement
  ).textContent = '$' + feeAmountTotal.toFixed(2)
  ;(
    lotOccupancyFeesContainerElement.querySelector(
      '#lotOccupancyFees--taxAmountTotal'
    ) as HTMLElement
  ).textContent = '$' + taxAmountTotal.toFixed(2)
  ;(
    lotOccupancyFeesContainerElement.querySelector(
      '#lotOccupancyFees--grandTotal'
    ) as HTMLElement
  ).textContent = '$' + (feeAmountTotal + taxAmountTotal).toFixed(2)

  renderLotOccupancyTransactions()
}

document.querySelector('#button--addFee')!.addEventListener('click', () => {
  if (hasUnsavedChanges) {
    bulmaJS.alert({
      message: 'Please save all unsaved changes before adding fees.',
      contextualColorName: 'warning'
    })
    return
  }

  let feeCategories: recordTypes.FeeCategory[]

  let feeFilterElement: HTMLInputElement
  let feeFilterResultsElement: HTMLElement

  const doAddFee = (feeId: number, quantity: number | string = 1) => {
    cityssm.postJSON(
      los.urlPrefix + '/lotOccupancies/doAddLotOccupancyFee',
      {
        lotOccupancyId,
        feeId,
        quantity
      },
      (responseJSON: {
        success: boolean
        errorMessage?: string
        lotOccupancyFees?: recordTypes.LotOccupancyFee[]
      }) => {
        if (responseJSON.success) {
          lotOccupancyFees = responseJSON.lotOccupancyFees!
          renderLotOccupancyFees()
          filterFees()
        } else {
          bulmaJS.alert({
            title: 'Error Adding Fee',
            message: responseJSON.errorMessage || '',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  const doSetQuantityAndAddFee = (fee: recordTypes.Fee) => {
    let quantityElement: HTMLInputElement
    let quantityCloseModalFunction: () => void

    const doSetQuantity = (submitEvent: SubmitEvent) => {
      submitEvent.preventDefault()
      doAddFee(fee.feeId!, quantityElement.value)
      quantityCloseModalFunction()
    }

    cityssm.openHtmlModal('lotOccupancy-setFeeQuantity', {
      onshow: (modalElement) => {
        ;(
          modalElement.querySelector(
            '#lotOccupancyFeeQuantity--quantityUnit'
          ) as HTMLElement
        ).textContent = fee.quantityUnit!
      },
      onshown: (modalElement, closeModalFunction) => {
        quantityCloseModalFunction = closeModalFunction

        quantityElement = modalElement.querySelector(
          '#lotOccupancyFeeQuantity--quantity'
        ) as HTMLInputElement

        modalElement
          .querySelector('form')!
          .addEventListener('submit', doSetQuantity)
      }
    })
  }

  const tryAddFee = (clickEvent: Event) => {
    clickEvent.preventDefault()

    const feeId = Number.parseInt(
      (clickEvent.currentTarget as HTMLElement).dataset.feeId!,
      10
    )
    const feeCategoryId = Number.parseInt(
      (
        (clickEvent.currentTarget as HTMLElement).closest(
          '.container--feeCategory'
        ) as HTMLElement
      ).dataset.feeCategoryId!,
      10
    )

    const feeCategory = feeCategories.find((currentFeeCategory) => {
      return currentFeeCategory.feeCategoryId === feeCategoryId
    })!

    const fee = feeCategory.fees!.find((currentFee) => {
      return currentFee.feeId === feeId
    })!

    if (fee.includeQuantity) {
      doSetQuantityAndAddFee(fee)
    } else {
      doAddFee(feeId)
    }
  }

  const filterFees = () => {
    const filterStringPieces = feeFilterElement.value
      .trim()
      .toLowerCase()
      .split(' ')

    feeFilterResultsElement.innerHTML = ''

    for (const feeCategory of feeCategories) {
      const categoryContainerElement = document.createElement('div')
      categoryContainerElement.className = 'container--feeCategory'
      categoryContainerElement.dataset.feeCategoryId =
        feeCategory.feeCategoryId!.toString()
      categoryContainerElement.innerHTML =
        '<h4 class="title is-5 mt-2">' +
        cityssm.escapeHTML(feeCategory.feeCategory || '') +
        '</h4>' +
        '<div class="panel mb-5"></div>'

      let hasFees = false

      for (const fee of feeCategory.fees!) {
        if (
          lotOccupancyFeesContainerElement.querySelector(
            ".container--lotOccupancyFee[data-fee-id='" +
              fee.feeId +
              "'][data-include-quantity='0']"
          )
        ) {
          continue
        }

        let includeFee = true

        for (const filterStringPiece of filterStringPieces) {
          if (!fee.feeName!.toLowerCase().includes(filterStringPiece)) {
            includeFee = false
            break
          }
        }

        if (!includeFee) {
          continue
        }

        hasFees = true

        const panelBlockElement = document.createElement('a')
        panelBlockElement.className = 'panel-block is-block container--fee'
        panelBlockElement.dataset.feeId = fee.feeId!.toString()
        panelBlockElement.href = '#'

        panelBlockElement.innerHTML =
          '<strong>' +
          cityssm.escapeHTML(fee.feeName || '') +
          '</strong><br />' +
          '<small>' +
          cityssm
            .escapeHTML(fee.feeDescription || '')
            .replace(/\n/g, '<br />') +
          '</small>'

        panelBlockElement.addEventListener('click', tryAddFee)

        ;(
          categoryContainerElement.querySelector('.panel') as HTMLElement
        ).append(panelBlockElement)
      }

      if (hasFees) {
        feeFilterResultsElement.append(categoryContainerElement)
      }
    }
  }

  cityssm.openHtmlModal('lotOccupancy-addFee', {
    onshow: (modalElement) => {
      feeFilterElement = modalElement.querySelector(
        '#feeSelect--feeName'
      ) as HTMLInputElement

      feeFilterResultsElement = modalElement.querySelector(
        '#resultsContainer--feeSelect'
      ) as HTMLElement

      cityssm.postJSON(
        los.urlPrefix + '/lotOccupancies/doGetFees',
        {
          lotOccupancyId
        },
        (responseJSON: { feeCategories: recordTypes.FeeCategory[] }) => {
          feeCategories = responseJSON.feeCategories

          feeFilterElement.disabled = false
          feeFilterElement.addEventListener('keyup', filterFees)
          feeFilterElement.focus()

          filterFees()
        }
      )
    },
    onshown: () => {
      bulmaJS.toggleHtmlClipped()
    },
    onhidden: () => {
      renderLotOccupancyFees()
    },
    onremoved: () => {
      bulmaJS.toggleHtmlClipped()
    }
  })
})

let lotOccupancyTransactions: recordTypes.LotOccupancyTransaction[] =
  exports.lotOccupancyTransactions
delete exports.lotOccupancyTransactions

const lotOccupancyTransactionsContainerElement = document.querySelector(
  '#container--lotOccupancyTransactions'
) as HTMLElement

const getTransactionGrandTotal = (): number => {
  let transactionGrandTotal = 0

  for (const lotOccupancyTransaction of lotOccupancyTransactions) {
    transactionGrandTotal += lotOccupancyTransaction.transactionAmount
  }

  return transactionGrandTotal
}

const deleteLotOccupancyTransaction = (clickEvent: Event) => {
  const transactionIndex = (
    (clickEvent.currentTarget as HTMLElement).closest(
      '.container--lotOccupancyTransaction'
    ) as HTMLElement
  ).dataset.transactionIndex

  const doDelete = () => {
    cityssm.postJSON(
      los.urlPrefix + '/lotOccupancies/doDeleteLotOccupancyTransaction',
      {
        lotOccupancyId,
        transactionIndex
      },
      (responseJSON: {
        success: boolean
        errorMessage?: string
        lotOccupancyTransactions?: recordTypes.LotOccupancyTransaction[]
      }) => {
        if (responseJSON.success) {
          lotOccupancyTransactions = responseJSON.lotOccupancyTransactions!
          renderLotOccupancyTransactions()
        } else {
          bulmaJS.alert({
            title: 'Error Deleting Transaction',
            message: responseJSON.errorMessage || '',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  bulmaJS.confirm({
    title: 'Delete Trasnaction',
    message: 'Are you sure you want to delete this transaction?',
    contextualColorName: 'warning',
    okButton: {
      text: 'Yes, Delete Transaction',
      callbackFunction: doDelete
    }
  })
}

const renderLotOccupancyTransactions = () => {
  if (lotOccupancyTransactions.length === 0) {
    lotOccupancyTransactionsContainerElement.innerHTML =
      '<div class="message ' +
      (lotOccupancyFees.length === 0 ? 'is-info' : 'is-warning') +
      '">' +
      '<p class="message-body">There are no transactions associated with this record.</p>' +
      '</div>'

    return
  }

  lotOccupancyTransactionsContainerElement.innerHTML =
    '<table class="table is-fullwidth is-striped is-hoverable">' +
    '<thead><tr>' +
    '<th class="has-width-1">Date</th>' +
    '<th>' +
    cityssm.escapeHTML(exports.aliases.externalReceiptNumber) +
    '</th>' +
    '<th class="has-text-right has-width-1">Amount</th>' +
    '<th class="has-width-1 is-hidden-print"><span class="is-sr-only">Options</span></th>' +
    '</tr></thead>' +
    '<tbody></tbody>' +
    ('<tfoot><tr>' +
      '<th colspan="2">Transaction Total</th>' +
      '<td class="has-text-weight-bold has-text-right" id="lotOccupancyTransactions--grandTotal"></td>' +
      '<td class="is-hidden-print"></td>' +
      '</tr></tfoot>') +
    '</table>'

  let transactionGrandTotal = 0

  for (const lotOccupancyTransaction of lotOccupancyTransactions) {
    transactionGrandTotal += lotOccupancyTransaction.transactionAmount

    const tableRowElement = document.createElement('tr')
    tableRowElement.className = 'container--lotOccupancyTransaction'
    tableRowElement.dataset.transactionIndex =
      lotOccupancyTransaction.transactionIndex!.toString()

    tableRowElement.innerHTML =
      '<td>' +
      lotOccupancyTransaction.transactionDateString +
      '</td>' +
      ('<td>' +
        cityssm.escapeHTML(
          lotOccupancyTransaction.externalReceiptNumber || ''
        ) +
        '<br />' +
        '<small>' +
        cityssm.escapeHTML(lotOccupancyTransaction.transactionNote || '') +
        '</small>' +
        '</td>') +
      ('<td class="has-text-right">$' +
        lotOccupancyTransaction.transactionAmount.toFixed(2) +
        '</td>') +
      ('<td class="is-hidden-print">' +
        '<button class="button is-small is-danger is-light" data-tooltip="Delete Transaction" type="button">' +
        '<i class="fas fa-trash" aria-hidden="true"></i>' +
        '</button>' +
        '</td>')

    tableRowElement
      .querySelector('button')!
      .addEventListener('click', deleteLotOccupancyTransaction)

    lotOccupancyTransactionsContainerElement
      .querySelector('tbody')!
      .append(tableRowElement)
  }

  ;(
    lotOccupancyTransactionsContainerElement.querySelector(
      '#lotOccupancyTransactions--grandTotal'
    ) as HTMLElement
  ).textContent = '$' + transactionGrandTotal.toFixed(2)

  const feeGrandTotal = getFeeGrandTotal()

  if (feeGrandTotal > transactionGrandTotal) {
    lotOccupancyTransactionsContainerElement.insertAdjacentHTML(
      'afterbegin',
      '<div class="message is-warning">' +
        '<div class="message-body">' +
        '<div class="level">' +
        '<div class="level-left"><div class="level-item">Outstanding Balance</div></div>' +
        '<div class="level-right"><div class="level-item">$' +
        (feeGrandTotal - transactionGrandTotal).toFixed(2) +
        '</div></div>' +
        '</div>' +
        '</div>' +
        '</div>'
    )
  }
}

document
  .querySelector('#button--addTransaction')!
  .addEventListener('click', () => {
    let addCloseModalFunction: () => void

    const doAddTransaction = (submitEvent: SubmitEvent) => {
      submitEvent.preventDefault()

      cityssm.postJSON(
        los.urlPrefix + '/lotOccupancies/doAddLotOccupancyTransaction',
        submitEvent.currentTarget,
        (responseJSON: {
          success: boolean
          errorMessage?: string
          lotOccupancyTransactions?: recordTypes.LotOccupancyTransaction[]
        }) => {
          if (responseJSON.success) {
            lotOccupancyTransactions = responseJSON.lotOccupancyTransactions!
            addCloseModalFunction()
            renderLotOccupancyTransactions()
          } else {
            bulmaJS.confirm({
              title: 'Error Adding Transaction',
              message: responseJSON.errorMessage || '',
              contextualColorName: 'danger'
            })
          }
        }
      )
    }

    cityssm.openHtmlModal('lotOccupancy-addTransaction', {
      onshow: (modalElement) => {
        los.populateAliases(modalElement)

        ;(
          modalElement.querySelector(
            '#lotOccupancyTransactionAdd--lotOccupancyId'
          ) as HTMLInputElement
        ).value = lotOccupancyId.toString()

        const feeGrandTotal = getFeeGrandTotal()
        const transactionGrandTotal = getTransactionGrandTotal()

        const transactionAmountElement = modalElement.querySelector(
          '#lotOccupancyTransactionAdd--transactionAmount'
        ) as HTMLInputElement

        transactionAmountElement.min = (-1 * transactionGrandTotal).toFixed(2)
        transactionAmountElement.max = Math.max(
          feeGrandTotal - transactionGrandTotal,
          0
        ).toFixed(2)
        transactionAmountElement.value = Math.max(
          feeGrandTotal - transactionGrandTotal,
          0
        ).toFixed(2)
      },
      onshown: (modalElement, closeModalFunction) => {
        bulmaJS.toggleHtmlClipped()

        addCloseModalFunction = closeModalFunction

        modalElement
          .querySelector('form')!
          .addEventListener('submit', doAddTransaction)
      },
      onremoved: () => {
        bulmaJS.toggleHtmlClipped()
      }
    })
  })

renderLotOccupancyFees()
