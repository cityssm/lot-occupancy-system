// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */

import type { BulmaJS } from '@cityssm/bulma-js/types.js'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types.js'

import type * as globalTypes from '../../types/globalTypes.js'
import type * as recordTypes from '../../types/recordTypes.js'

declare const cityssm: cityssmGlobal
declare const bulmaJS: BulmaJS

declare const los: globalTypes.LOS

declare const lotOccupancyId: string

declare const exports: Record<string, unknown>

let lotOccupancyFees = exports.lotOccupancyFees as recordTypes.LotOccupancyFee[]
delete exports.lotOccupancyFees

const lotOccupancyFeesContainerElement = document.querySelector(
  '#container--lotOccupancyFees'
) as HTMLElement

function getFeeGrandTotal(): number {
  let feeGrandTotal = 0

  for (const lotOccupancyFee of lotOccupancyFees) {
    feeGrandTotal +=
      ((lotOccupancyFee.feeAmount ?? 0) + (lotOccupancyFee.taxAmount ?? 0)) *
      (lotOccupancyFee.quantity ?? 0)
  }

  return feeGrandTotal
}

function editLotOccupancyFeeQuantity(clickEvent: Event): void {
  const feeId = Number.parseInt(
    (clickEvent.currentTarget as HTMLButtonElement).closest('tr')?.dataset
      .feeId ?? '',
    10
  )

  const fee = lotOccupancyFees.find((possibleFee) => {
    return possibleFee.feeId === feeId
  }) as recordTypes.LotOccupancyFee

  let updateCloseModalFunction: () => void

  function doUpdateQuantity(formEvent: SubmitEvent): void {
    formEvent.preventDefault()

    cityssm.postJSON(
      `${los.urlPrefix}/lotOccupancies/doUpdateLotOccupancyFeeQuantity`,
      formEvent.currentTarget,
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          success: boolean
          lotOccupancyFees: recordTypes.LotOccupancyFee[]
        }

        if (responseJSON.success) {
          lotOccupancyFees = responseJSON.lotOccupancyFees
          renderLotOccupancyFees()
          updateCloseModalFunction()
        } else {
          bulmaJS.alert({
            title: 'Error Updating Quantity',
            message: 'Please try again.',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  cityssm.openHtmlModal('lotOccupancy-editFeeQuantity', {
    onshow(modalElement) {
      ;(
        modalElement.querySelector(
          '#lotOccupancyFeeQuantity--lotOccupancyId'
        ) as HTMLInputElement
      ).value = lotOccupancyId
      ;(
        modalElement.querySelector(
          '#lotOccupancyFeeQuantity--feeId'
        ) as HTMLInputElement
      ).value = fee.feeId.toString()
      ;(
        modalElement.querySelector(
          '#lotOccupancyFeeQuantity--quantity'
        ) as HTMLInputElement
      ).valueAsNumber = fee.quantity ?? 0
      ;(
        modalElement.querySelector(
          '#lotOccupancyFeeQuantity--quantityUnit'
        ) as HTMLElement
      ).textContent = fee.quantityUnit ?? ''
    },
    onshown(modalElement, closeModalFunction) {
      bulmaJS.toggleHtmlClipped()

      updateCloseModalFunction = closeModalFunction
      ;(
        modalElement.querySelector(
          '#lotOccupancyFeeQuantity--quantity'
        ) as HTMLInputElement
      ).focus()

      modalElement
        .querySelector('form')
        ?.addEventListener('submit', doUpdateQuantity)
    },
    onremoved() {
      bulmaJS.toggleHtmlClipped()
    }
  })
}

function deleteLotOccupancyFee(clickEvent: Event): void {
  const feeId = (
    (clickEvent.currentTarget as HTMLElement).closest(
      '.container--lotOccupancyFee'
    ) as HTMLElement
  ).dataset.feeId

  function doDelete(): void {
    cityssm.postJSON(
      `${los.urlPrefix}/lotOccupancies/doDeleteLotOccupancyFee`,
      {
        lotOccupancyId,
        feeId
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          success: boolean
          errorMessage?: string
          lotOccupancyFees: recordTypes.LotOccupancyFee[]
        }

        if (responseJSON.success) {
          lotOccupancyFees = responseJSON.lotOccupancyFees
          renderLotOccupancyFees()
        } else {
          bulmaJS.alert({
            title: 'Error Deleting Fee',
            message: responseJSON.errorMessage ?? '',
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

function renderLotOccupancyFees(): void {
  if (lotOccupancyFees.length === 0) {
    lotOccupancyFeesContainerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no fees associated with this record.</p>
        </div>`

    renderLotOccupancyTransactions()

    return
  }

  // eslint-disable-next-line no-secrets/no-secrets
  lotOccupancyFeesContainerElement.innerHTML = `<table class="table is-fullwidth is-striped is-hoverable">
      <thead><tr>
        <th>Fee</th>
        <th><span class="is-sr-only">Unit Cost</span></th>
        <th class="has-width-1"><span class="is-sr-only">&times;</span></th>
        <th class="has-width-1"><span class="is-sr-only">Quantity</span></th>
        <th class="has-width-1"><span class="is-sr-only">equals</span></th>
        <th class="has-width-1 has-text-right">Total</th>
        <th class="has-width-1 is-hidden-print"><span class="is-sr-only">Options</span></th>
      </tr></thead>
      <tbody></tbody>
      <tfoot><tr>
        <th colspan="5">Subtotal</th>
        <td class="has-text-weight-bold has-text-right" id="lotOccupancyFees--feeAmountTotal"></td>
        <td class="is-hidden-print"></td>
      </tr><tr>
        <th colspan="5">Tax</th>
        <td class="has-text-right" id="lotOccupancyFees--taxAmountTotal"></td>
        <td class="is-hidden-print"></td>
      </tr><tr>
        <th colspan="5">Grand Total</th>
        <td class="has-text-weight-bold has-text-right" id="lotOccupancyFees--grandTotal"></td>
        <td class="is-hidden-print"></td>
      </tr></tfoot></table>`

  let feeAmountTotal = 0
  let taxAmountTotal = 0

  for (const lotOccupancyFee of lotOccupancyFees) {
    const tableRowElement = document.createElement('tr')
    tableRowElement.className = 'container--lotOccupancyFee'
    tableRowElement.dataset.feeId = lotOccupancyFee.feeId.toString()
    tableRowElement.dataset.includeQuantity =
      lotOccupancyFee.includeQuantity ?? false ? '1' : '0'

    // eslint-disable-next-line no-unsanitized/property
    tableRowElement.innerHTML = `<td colspan="${lotOccupancyFee.quantity === 1 ? '5' : '1'}">
      ${cityssm.escapeHTML(lotOccupancyFee.feeName ?? '')}<br />
      <span class="tag">${cityssm.escapeHTML(lotOccupancyFee.feeCategory ?? '')}</span>
      </td>
      ${
        lotOccupancyFee.quantity === 1
          ? ''
          : `<td class="has-text-right">
              $${lotOccupancyFee.feeAmount?.toFixed(2)}
              </td>
              <td>&times;</td>
              <td class="has-text-right">${lotOccupancyFee.quantity?.toString()}</td>
              <td>=</td>`
      }
      <td class="has-text-right">
        $${((lotOccupancyFee.feeAmount ?? 0) * (lotOccupancyFee.quantity ?? 0)).toFixed(2)}
      </td>
      <td class="is-hidden-print">
      <div class="buttons are-small is-flex-wrap-nowrap is-justify-content-end">
      ${
        lotOccupancyFee.includeQuantity ?? false
          ? `<button class="button is-primary button--editQuantity">
              <span class="icon is-small"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>
              <span>Edit</span>
              </button>`
          : ''
      }
      <button class="button is-danger is-light button--delete" data-tooltip="Delete Fee" type="button">
        <i class="fas fa-trash" aria-hidden="true"></i>
      </button>
      </div>
      </td>`

    tableRowElement
      .querySelector('.button--editQuantity')
      ?.addEventListener('click', editLotOccupancyFeeQuantity)

    tableRowElement
      .querySelector('.button--delete')
      ?.addEventListener('click', deleteLotOccupancyFee)

    lotOccupancyFeesContainerElement
      .querySelector('tbody')
      ?.append(tableRowElement)

    feeAmountTotal +=
      (lotOccupancyFee.feeAmount ?? 0) * (lotOccupancyFee.quantity ?? 0)

    taxAmountTotal +=
      (lotOccupancyFee.taxAmount ?? 0) * (lotOccupancyFee.quantity ?? 0)
  }

  ;(
    lotOccupancyFeesContainerElement.querySelector(
      '#lotOccupancyFees--feeAmountTotal'
    ) as HTMLElement
  ).textContent = `$${feeAmountTotal.toFixed(2)}`
  ;(
    lotOccupancyFeesContainerElement.querySelector(
      '#lotOccupancyFees--taxAmountTotal'
    ) as HTMLElement
  ).textContent = `$${taxAmountTotal.toFixed(2)}`
  ;(
    lotOccupancyFeesContainerElement.querySelector(
      '#lotOccupancyFees--grandTotal'
    ) as HTMLElement
  ).textContent = `$${(feeAmountTotal + taxAmountTotal).toFixed(2)}`

  renderLotOccupancyTransactions()
}

const addFeeButtonElement = document.querySelector(
  '#button--addFee'
) as HTMLButtonElement

addFeeButtonElement.addEventListener('click', () => {
  if (los.hasUnsavedChanges()) {
    bulmaJS.alert({
      message: 'Please save all unsaved changes before adding fees.',
      contextualColorName: 'warning'
    })
    return
  }

  let feeCategories: recordTypes.FeeCategory[]

  let feeFilterElement: HTMLInputElement
  let feeFilterResultsElement: HTMLElement

  function doAddFee(feeId: number, quantity: number | string = 1): void {
    cityssm.postJSON(
      `${los.urlPrefix}/lotOccupancies/doAddLotOccupancyFee`,
      {
        lotOccupancyId,
        feeId,
        quantity
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          success: boolean
          errorMessage?: string
          lotOccupancyFees: recordTypes.LotOccupancyFee[]
        }

        if (responseJSON.success) {
          lotOccupancyFees = responseJSON.lotOccupancyFees
          renderLotOccupancyFees()
          filterFees()
        } else {
          bulmaJS.alert({
            title: 'Error Adding Fee',
            message: responseJSON.errorMessage ?? '',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  function doSetQuantityAndAddFee(fee: recordTypes.Fee): void {
    let quantityElement: HTMLInputElement
    let quantityCloseModalFunction: () => void

    function doSetQuantity(submitEvent: SubmitEvent): void {
      submitEvent.preventDefault()
      doAddFee(fee.feeId, quantityElement.value)
      quantityCloseModalFunction()
    }

    cityssm.openHtmlModal('lotOccupancy-setFeeQuantity', {
      onshow(modalElement) {
        ;(
          modalElement.querySelector(
            '#lotOccupancyFeeQuantity--quantityUnit'
          ) as HTMLElement
        ).textContent = fee.quantityUnit ?? ''
      },
      onshown(modalElement, closeModalFunction) {
        quantityCloseModalFunction = closeModalFunction

        quantityElement = modalElement.querySelector(
          '#lotOccupancyFeeQuantity--quantity'
        ) as HTMLInputElement

        modalElement
          .querySelector('form')
          ?.addEventListener('submit', doSetQuantity)
      }
    })
  }

  function tryAddFee(clickEvent: Event): void {
    clickEvent.preventDefault()

    const feeId = Number.parseInt(
      (clickEvent.currentTarget as HTMLElement).dataset.feeId ?? '',
      10
    )
    const feeCategoryId = Number.parseInt(
      (clickEvent.currentTarget as HTMLElement).dataset.feeCategoryId ?? '',
      10
    )

    const feeCategory = feeCategories.find((currentFeeCategory) => {
      return currentFeeCategory.feeCategoryId === feeCategoryId
    }) as recordTypes.FeeCategory

    const fee = feeCategory.fees.find((currentFee) => {
      return currentFee.feeId === feeId
    }) as recordTypes.Fee

    if (fee.includeQuantity ?? false) {
      doSetQuantityAndAddFee(fee)
    } else {
      doAddFee(feeId)
    }
  }

  function filterFees(): void {
    const filterStringPieces = feeFilterElement.value
      .trim()
      .toLowerCase()
      .split(' ')

    feeFilterResultsElement.innerHTML = ''

    for (const feeCategory of feeCategories) {
      const categoryContainerElement = document.createElement('div')

      categoryContainerElement.className = 'container--feeCategory'

      categoryContainerElement.dataset.feeCategoryId =
        feeCategory.feeCategoryId.toString()

      categoryContainerElement.innerHTML = `<h4 class="title is-5 mt-2">
        ${cityssm.escapeHTML(feeCategory.feeCategory ?? '')}
        </h4>
        <div class="panel mb-5"></div>`

      let hasFees = false

      for (const fee of feeCategory.fees) {
        // Don't include already applied fees that limit quantity
        if (
          lotOccupancyFeesContainerElement.querySelector(
            `.container--lotOccupancyFee[data-fee-id='${fee.feeId}'][data-include-quantity='0']`
          ) !== null
        ) {
          continue
        }

        let includeFee = true

        const feeSearchString =
          `${feeCategory.feeCategory ?? ''} ${fee.feeName ?? ''} ${fee.feeDescription ?? ''}`.toLowerCase()

        for (const filterStringPiece of filterStringPieces) {
          if (!feeSearchString.includes(filterStringPiece)) {
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
        panelBlockElement.dataset.feeId = fee.feeId.toString()
        panelBlockElement.dataset.feeCategoryId =
          feeCategory.feeCategoryId.toString()
        panelBlockElement.href = '#'

        // eslint-disable-next-line no-unsanitized/property
        panelBlockElement.innerHTML = `<strong>${cityssm.escapeHTML(fee.feeName ?? '')}</strong><br />
          <small>
          ${cityssm
            .escapeHTML(fee.feeDescription ?? '')
            .replaceAll('\n', '<br />')}
          </small>`

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
    onshow(modalElement) {
      feeFilterElement = modalElement.querySelector(
        '#feeSelect--feeName'
      ) as HTMLInputElement

      feeFilterResultsElement = modalElement.querySelector(
        '#resultsContainer--feeSelect'
      ) as HTMLElement

      cityssm.postJSON(
        `${los.urlPrefix}/lotOccupancies/doGetFees`,
        {
          lotOccupancyId
        },
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            feeCategories: recordTypes.FeeCategory[]
          }

          feeCategories = responseJSON.feeCategories

          feeFilterElement.disabled = false
          feeFilterElement.addEventListener('keyup', filterFees)
          feeFilterElement.focus()

          filterFees()
        }
      )
    },
    onshown() {
      bulmaJS.toggleHtmlClipped()
    },
    onhidden() {
      renderLotOccupancyFees()
    },
    onremoved() {
      bulmaJS.toggleHtmlClipped()
      addFeeButtonElement.focus()
    }
  })
})

let lotOccupancyTransactions =
  exports.lotOccupancyTransactions as recordTypes.LotOccupancyTransaction[]
delete exports.lotOccupancyTransactions

const lotOccupancyTransactionsContainerElement = document.querySelector(
  '#container--lotOccupancyTransactions'
) as HTMLElement

function getTransactionGrandTotal(): number {
  let transactionGrandTotal = 0

  for (const lotOccupancyTransaction of lotOccupancyTransactions) {
    transactionGrandTotal += lotOccupancyTransaction.transactionAmount
  }

  return transactionGrandTotal
}

function editLotOccupancyTransaction(clickEvent: Event): void {
  const transactionIndex = Number.parseInt(
    (clickEvent.currentTarget as HTMLButtonElement).closest('tr')?.dataset
      .transactionIndex ?? '',
    10
  )

  const transaction = lotOccupancyTransactions.find((possibleTransaction) => {
    return possibleTransaction.transactionIndex === transactionIndex
  }) as recordTypes.LotOccupancyTransaction

  let editCloseModalFunction: () => void

  function doEdit(formEvent: SubmitEvent): void {
    formEvent.preventDefault()

    cityssm.postJSON(
      `${los.urlPrefix}/lotOccupancies/doUpdateLotOccupancyTransaction`,
      formEvent.currentTarget,
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          success: boolean
          lotOccupancyTransactions: recordTypes.LotOccupancyTransaction[]
        }

        if (responseJSON.success) {
          lotOccupancyTransactions = responseJSON.lotOccupancyTransactions
          renderLotOccupancyTransactions()
          editCloseModalFunction()
        } else {
          bulmaJS.alert({
            title: 'Error Updating Transaction',
            message: 'Please try again.',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  cityssm.openHtmlModal('lotOccupancy-editTransaction', {
    onshow(modalElement) {
      los.populateAliases(modalElement)
      ;(
        modalElement.querySelector(
          '#lotOccupancyTransactionEdit--lotOccupancyId'
        ) as HTMLInputElement
      ).value = lotOccupancyId
      ;(
        modalElement.querySelector(
          '#lotOccupancyTransactionEdit--transactionIndex'
        ) as HTMLInputElement
      ).value = transaction.transactionIndex?.toString() ?? ''
      ;(
        modalElement.querySelector(
          '#lotOccupancyTransactionEdit--transactionAmount'
        ) as HTMLInputElement
      ).value = transaction.transactionAmount.toFixed(2)
      ;(
        modalElement.querySelector(
          '#lotOccupancyTransactionEdit--externalReceiptNumber'
        ) as HTMLInputElement
      ).value = transaction.externalReceiptNumber ?? ''
      ;(
        modalElement.querySelector(
          '#lotOccupancyTransactionEdit--transactionNote'
        ) as HTMLTextAreaElement
      ).value = transaction.transactionNote ?? ''
      ;(
        modalElement.querySelector(
          '#lotOccupancyTransactionEdit--transactionDateString'
        ) as HTMLInputElement
      ).value = transaction.transactionDateString ?? ''
      ;(
        modalElement.querySelector(
          '#lotOccupancyTransactionEdit--transactionTimeString'
        ) as HTMLInputElement
      ).value = transaction.transactionTimeString ?? ''
    },
    onshown(modalElement, closeModalFunction) {
      bulmaJS.toggleHtmlClipped()

      los.initializeDatePickers(modalElement)
      ;(
        modalElement.querySelector(
          '#lotOccupancyTransactionEdit--transactionAmount'
        ) as HTMLInputElement
      ).focus()

      modalElement.querySelector('form')?.addEventListener('submit', doEdit)

      editCloseModalFunction = closeModalFunction
    },
    onremoved() {
      bulmaJS.toggleHtmlClipped()
    }
  })
}

function deleteLotOccupancyTransaction(clickEvent: Event): void {
  const transactionIndex = (
    (clickEvent.currentTarget as HTMLElement).closest(
      '.container--lotOccupancyTransaction'
    ) as HTMLElement
  ).dataset.transactionIndex

  function doDelete(): void {
    cityssm.postJSON(
      `${los.urlPrefix}/lotOccupancies/doDeleteLotOccupancyTransaction`,
      {
        lotOccupancyId,
        transactionIndex
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          success: boolean
          errorMessage?: string
          lotOccupancyTransactions: recordTypes.LotOccupancyTransaction[]
        }

        if (responseJSON.success) {
          lotOccupancyTransactions = responseJSON.lotOccupancyTransactions
          renderLotOccupancyTransactions()
        } else {
          bulmaJS.alert({
            title: 'Error Deleting Transaction',
            message: responseJSON.errorMessage ?? '',
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

function renderLotOccupancyTransactions(): void {
  if (lotOccupancyTransactions.length === 0) {
    // eslint-disable-next-line no-unsanitized/property
    lotOccupancyTransactionsContainerElement.innerHTML = `<div class="message ${lotOccupancyFees.length === 0 ? 'is-info' : 'is-warning'}">
      <p class="message-body">There are no transactions associated with this record.</p>
      </div>`

    return
  }

  // eslint-disable-next-line no-unsanitized/property
  lotOccupancyTransactionsContainerElement.innerHTML = `<table class="table is-fullwidth is-striped is-hoverable">
      <thead><tr>
        <th class="has-width-1">Date</th>
        <th>${los.escapedAliases.ExternalReceiptNumber}</th>
        <th class="has-text-right has-width-1">Amount</th>
        <th class="has-width-1 is-hidden-print"><span class="is-sr-only">Options</span></th>
      </tr></thead>
      <tbody></tbody>
      <tfoot><tr>
        <th colspan="2">Transaction Total</th>
        <td class="has-text-weight-bold has-text-right" id="lotOccupancyTransactions--grandTotal"></td>
        <td class="is-hidden-print"></td>
      </tr></tfoot>
      </table>`

  let transactionGrandTotal = 0

  for (const lotOccupancyTransaction of lotOccupancyTransactions) {
    transactionGrandTotal += lotOccupancyTransaction.transactionAmount

    const tableRowElement = document.createElement('tr')
    tableRowElement.className = 'container--lotOccupancyTransaction'
    tableRowElement.dataset.transactionIndex =
      lotOccupancyTransaction.transactionIndex?.toString()

    let externalReceiptNumberHTML = ''

    if (lotOccupancyTransaction.externalReceiptNumber !== '') {
      externalReceiptNumberHTML = cityssm.escapeHTML(
        lotOccupancyTransaction.externalReceiptNumber ?? ''
      )

      if (los.dynamicsGPIntegrationIsEnabled) {
        if (lotOccupancyTransaction.dynamicsGPDocument === undefined) {
          externalReceiptNumberHTML += ` <span data-tooltip="No Matching Document Found">
            <i class="fas fa-times-circle has-text-danger" aria-label="No Matching Document Found"></i>
            </span>`
        } else if (
          lotOccupancyTransaction.dynamicsGPDocument.documentTotal.toFixed(
            2
          ) === lotOccupancyTransaction.transactionAmount.toFixed(2)
        ) {
          externalReceiptNumberHTML += ` <span data-tooltip="Matching Document Found">
            <i class="fas fa-check-circle has-text-success" aria-label="Matching Document Found"></i>
            </span>`
        } else {
          externalReceiptNumberHTML += ` <span data-tooltip="Matching Document: $${lotOccupancyTransaction.dynamicsGPDocument.documentTotal.toFixed(
            2
          )}">
            <i class="fas fa-check-circle has-text-warning" aria-label="Matching Document: $${lotOccupancyTransaction.dynamicsGPDocument.documentTotal.toFixed(
              2
            )}"></i>
            </span>`
        }
      }

      externalReceiptNumberHTML += '<br />'
    }

    // eslint-disable-next-line no-unsanitized/property
    tableRowElement.innerHTML = `<td>
      ${cityssm.escapeHTML(lotOccupancyTransaction.transactionDateString ?? '')}
      </td>
      <td>
        ${externalReceiptNumberHTML}
        <small>${cityssm.escapeHTML(lotOccupancyTransaction.transactionNote ?? '')}</small>
      </td>
      <td class="has-text-right">
        $${cityssm.escapeHTML(lotOccupancyTransaction.transactionAmount.toFixed(2))}
      </td>
      <td class="is-hidden-print">
        <div class="buttons are-small is-flex-wrap-nowrap is-justify-content-end">
          <button class="button is-primary button--edit" type="button">
            <span class="icon"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>
            <span>Edit</span>
          </button>
          <button class="button is-danger is-light button--delete" data-tooltip="Delete Transaction" type="button">
            <i class="fas fa-trash" aria-hidden="true"></i>
          </button>
        </div>
      </td>`

    tableRowElement
      .querySelector('.button--edit')
      ?.addEventListener('click', editLotOccupancyTransaction)

    tableRowElement
      .querySelector('.button--delete')
      ?.addEventListener('click', deleteLotOccupancyTransaction)

    lotOccupancyTransactionsContainerElement
      .querySelector('tbody')
      ?.append(tableRowElement)
  }

  ;(
    lotOccupancyTransactionsContainerElement.querySelector(
      '#lotOccupancyTransactions--grandTotal'
    ) as HTMLElement
  ).textContent = `\$${transactionGrandTotal.toFixed(2)}`

  const feeGrandTotal = getFeeGrandTotal()

  if (feeGrandTotal.toFixed(2) !== transactionGrandTotal.toFixed(2)) {
    lotOccupancyTransactionsContainerElement.insertAdjacentHTML(
      'afterbegin',
      `<div class="message is-warning">
        <div class="message-body">
        <div class="level">
          <div class="level-left">
            <div class="level-item">Outstanding Balance</div>
          </div>
          <div class="level-right">
            <div class="level-item">
              $${cityssm.escapeHTML((feeGrandTotal - transactionGrandTotal).toFixed(2))}
            </div>
          </div>
        </div>
        </div></div>`
    )
  }
}

const addTransactionButtonElement = document.querySelector(
  '#button--addTransaction'
) as HTMLButtonElement

addTransactionButtonElement.addEventListener('click', () => {
  let transactionAmountElement: HTMLInputElement
  let externalReceiptNumberElement: HTMLInputElement

  let addCloseModalFunction: () => void

  function doAddTransaction(submitEvent: SubmitEvent): void {
    submitEvent.preventDefault()

    cityssm.postJSON(
      `${los.urlPrefix}/lotOccupancies/doAddLotOccupancyTransaction`,
      submitEvent.currentTarget,
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          success: boolean
          errorMessage?: string
          lotOccupancyTransactions: recordTypes.LotOccupancyTransaction[]
        }

        if (responseJSON.success) {
          lotOccupancyTransactions = responseJSON.lotOccupancyTransactions
          addCloseModalFunction()
          renderLotOccupancyTransactions()
        } else {
          bulmaJS.confirm({
            title: 'Error Adding Transaction',
            message: responseJSON.errorMessage ?? '',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  function dynamicsGP_refreshExternalReceiptNumberIcon(): void {
    const externalReceiptNumber = externalReceiptNumberElement.value

    const iconElement = externalReceiptNumberElement
      .closest('.control')
      ?.querySelector('.icon') as HTMLElement

    const helpTextElement = externalReceiptNumberElement
      .closest('.field')
      ?.querySelector('.help') as HTMLElement

    if (externalReceiptNumber === '') {
      helpTextElement.innerHTML = '&nbsp;'
      iconElement.innerHTML = '<i class="fas fa-minus" aria-hidden="true"></i>'
      return
    }

    cityssm.postJSON(
      `${los.urlPrefix}/lotOccupancies/doGetDynamicsGPDocument`,
      {
        externalReceiptNumber
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          success: boolean
          dynamicsGPDocument?: recordTypes.DynamicsGPDocument
        }

        if (
          !responseJSON.success ||
          responseJSON.dynamicsGPDocument === undefined
        ) {
          helpTextElement.textContent = 'No Matching Document Found'
          iconElement.innerHTML =
            '<i class="fas fa-times-circle" aria-hidden="true"></i>'
        } else if (
          transactionAmountElement.valueAsNumber ===
          responseJSON.dynamicsGPDocument.documentTotal
        ) {
          helpTextElement.textContent = 'Matching Document Found'
          iconElement.innerHTML =
            '<i class="fas fa-check-circle" aria-hidden="true"></i>'
        } else {
          helpTextElement.textContent = `Matching Document: $${responseJSON.dynamicsGPDocument.documentTotal.toFixed(2)}`
          iconElement.innerHTML =
            '<i class="fas fa-exclamation-triangle" aria-hidden="true"></i>'
        }
      }
    )
  }

  cityssm.openHtmlModal('lotOccupancy-addTransaction', {
    onshow(modalElement) {
      los.populateAliases(modalElement)
      ;(
        modalElement.querySelector(
          '#lotOccupancyTransactionAdd--lotOccupancyId'
        ) as HTMLInputElement
      ).value = lotOccupancyId.toString()

      const feeGrandTotal = getFeeGrandTotal()
      const transactionGrandTotal = getTransactionGrandTotal()

      transactionAmountElement = modalElement.querySelector(
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

      if (los.dynamicsGPIntegrationIsEnabled) {
        externalReceiptNumberElement = modalElement.querySelector(
          // eslint-disable-next-line no-secrets/no-secrets
          '#lotOccupancyTransactionAdd--externalReceiptNumber'
        ) as HTMLInputElement

        const externalReceiptNumberControlElement =
          externalReceiptNumberElement.closest('.control') as HTMLElement

        externalReceiptNumberControlElement.classList.add('has-icons-right')

        externalReceiptNumberControlElement.insertAdjacentHTML(
          'beforeend',
          '<span class="icon is-small is-right"></span>'
        )

        externalReceiptNumberControlElement.insertAdjacentHTML(
          'afterend',
          '<p class="help has-text-right"></p>'
        )

        externalReceiptNumberElement.addEventListener(
          'change',
          dynamicsGP_refreshExternalReceiptNumberIcon
        )

        transactionAmountElement.addEventListener(
          'change',
          dynamicsGP_refreshExternalReceiptNumberIcon
        )

        dynamicsGP_refreshExternalReceiptNumberIcon()
      }
    },
    onshown(modalElement, closeModalFunction) {
      bulmaJS.toggleHtmlClipped()

      transactionAmountElement.focus()

      addCloseModalFunction = closeModalFunction

      modalElement
        .querySelector('form')
        ?.addEventListener('submit', doAddTransaction)
    },
    onremoved() {
      bulmaJS.toggleHtmlClipped()
      addTransactionButtonElement.focus()
    }
  })
})

renderLotOccupancyFees()
