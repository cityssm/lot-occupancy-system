/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */

import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types'
import type { BulmaJS } from '@cityssm/bulma-js/types'

import type * as globalTypes from '../../types/globalTypes'
import type * as recordTypes from '../../types/recordTypes'

declare const cityssm: cityssmGlobal
declare const bulmaJS: BulmaJS

declare const los: globalTypes.LOS

declare const workOrderId: string

let workOrderLots: recordTypes.Lot[] = exports.workOrderLots
delete exports.workOrderLots

let workOrderLotOccupancies: recordTypes.LotOccupancy[] =
  exports.workOrderLotOccupancies
delete exports.workOrderLotOccupancies

function deleteLotOccupancy(clickEvent: Event): void {
  const lotOccupancyId = (
    (clickEvent.currentTarget as HTMLElement).closest(
      '.container--lotOccupancy'
    ) as HTMLElement
  ).dataset.lotOccupancyId

  function doDelete(): void {
    cityssm.postJSON(
      los.urlPrefix + '/workOrders/doDeleteWorkOrderLotOccupancy',
      {
        workOrderId,
        lotOccupancyId
      },
      (responseJSON: {
        success: boolean
        errorMessage?: string
        workOrderLotOccupancies?: recordTypes.LotOccupancy[]
      }) => {
        if (responseJSON.success) {
          workOrderLotOccupancies = responseJSON.workOrderLotOccupancies!
          renderRelatedLotsAndOccupancies()
        } else {
          bulmaJS.alert({
            title: 'Error Deleting Relationship',
            message: responseJSON.errorMessage ?? '',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  bulmaJS.confirm({
    title: `Delete ${los.escapedAliases.Occupancy} Relationship`,
    message: `Are you sure you want to remove the relationship to this ${los.escapedAliases.occupancy} record from this work order?  Note that the record will remain.`,
    contextualColorName: 'warning',
    okButton: {
      text: 'Yes, Delete Relationship',
      callbackFunction: doDelete
    }
  })
}

function addLot(
  lotId: number | string,
  callbackFunction?: (success?: boolean) => void
): void {
  cityssm.postJSON(
    los.urlPrefix + '/workOrders/doAddWorkOrderLot',
    {
      workOrderId,
      lotId
    },
    (responseJSON: {
      success: boolean
      errorMessage?: string
      workOrderLots?: recordTypes.Lot[]
    }) => {
      if (responseJSON.success) {
        workOrderLots = responseJSON.workOrderLots!
        renderRelatedLotsAndOccupancies()
      } else {
        bulmaJS.alert({
          title: `Error Adding ${los.escapedAliases.Lot}`,
          message: responseJSON.errorMessage ?? '',
          contextualColorName: 'danger'
        })
      }

      if (callbackFunction) {
        callbackFunction(responseJSON.success)
      }
    }
  )
}

function addLotOccupancy(
  lotOccupancyId: number | string,
  callbackFunction?: (success?: boolean) => void
): void {
  cityssm.postJSON(
    los.urlPrefix + '/workOrders/doAddWorkOrderLotOccupancy',
    {
      workOrderId,
      lotOccupancyId
    },
    (responseJSON: {
      success: boolean
      errorMessage?: string
      workOrderLotOccupancies?: recordTypes.LotOccupancy[]
    }) => {
      if (responseJSON.success) {
        workOrderLotOccupancies = responseJSON.workOrderLotOccupancies!
        renderRelatedLotsAndOccupancies()
      } else {
        bulmaJS.alert({
          title: 'Error Adding ' + los.escapedAliases.Occupancy,
          message: responseJSON.errorMessage ?? '',
          contextualColorName: 'danger'
        })
      }

      if (callbackFunction) {
        callbackFunction(responseJSON.success)
      }
    }
  )
}

function addLotFromLotOccupancy(clickEvent: Event): void {
  const lotId = (clickEvent.currentTarget as HTMLElement).dataset.lotId!
  addLot(lotId)
}

function renderRelatedOccupancies(): void {
  const occupanciesContainerElement = document.querySelector(
    '#container--lotOccupancies'
  ) as HTMLElement

  ;(
    document.querySelector(
      ".tabs a[href='#relatedTab--lotOccupancies'] .tag"
    ) as HTMLElement
  ).textContent = workOrderLotOccupancies.length.toString()

  if (workOrderLotOccupancies.length === 0) {
    occupanciesContainerElement.innerHTML = `<div class="message is-info">
            <p class="message-body">There are no ${los.escapedAliases.occupancies} associated with this work order.</p>
            </div>`

    return
  }

  occupanciesContainerElement.innerHTML = `<table class="table is-fullwidth is-striped is-hoverable">
        <thead><tr>
        <th class="has-width-1"></th>
        <th>${los.escapedAliases.Occupancy} Type</th>
        <th>${los.escapedAliases.Lot}</th>
        <th>${los.escapedAliases.OccupancyStartDate}</th>
        <th>End Date</th>
        <th>${los.escapedAliases.Occupants}</th>
        <th class="has-width-1"></th>
        </tr></thead>
        <tbody></tbody>
        </table>`

  const currentDateString = cityssm.dateToString(new Date())

  for (const lotOccupancy of workOrderLotOccupancies) {
    const rowElement = document.createElement('tr')
    rowElement.className = 'container--lotOccupancy'
    rowElement.dataset.lotOccupancyId = lotOccupancy.lotOccupancyId!.toString()

    const isActive = !(
      lotOccupancy.occupancyEndDate &&
      lotOccupancy.occupancyEndDateString! < currentDateString
    )

    const hasLotRecord =
      lotOccupancy.lotId &&
      workOrderLots.some((lot) => {
        return lotOccupancy.lotId === lot.lotId
      })

    rowElement.innerHTML =
      '<td class="is-width-1 has-text-centered">' +
      (isActive
        ? '<i class="fas fa-play" title="Current ' +
          los.escapedAliases.Occupancy +
          '"></i>'
        : '<i class="fas fa-stop" title="Previous ' +
          los.escapedAliases.Occupancy +
          '"></i>') +
      '</td>' +
      ('<td>' +
        '<a class="has-text-weight-bold" href="' +
        los.getLotOccupancyURL(lotOccupancy.lotOccupancyId) +
        '">' +
        cityssm.escapeHTML(lotOccupancy.occupancyType ?? '') +
        '</a>' +
        '</td>')

    if (lotOccupancy.lotId) {
      rowElement.insertAdjacentHTML(
        'beforeend',
        '<td>' +
          cityssm.escapeHTML(lotOccupancy.lotName ?? '') +
          (hasLotRecord
            ? ''
            : ' <button class="button is-small is-light is-success button--addLot"' +
              ' data-lot-id="' +
              lotOccupancy.lotId +
              '"' +
              ' data-tooltip="Add ' +
              los.escapedAliases.Lot +
              '"' +
              ' aria-label="Add ' +
              los.escapedAliases.Lot +
              '" type="button">' +
              '<i class="fas fa-plus" aria-hidden="true"></i>' +
              '</button>') +
          '</td>'
      )
    } else {
      rowElement.insertAdjacentHTML(
        'beforeend',
        `<td><span class="has-text-grey">(No ${los.escapedAliases.Lot})</span></td>`
      )
    }

    rowElement.insertAdjacentHTML(
      'beforeend',
      '<td>' +
        lotOccupancy.occupancyStartDateString +
        '</td>' +
        ('<td>' +
          (lotOccupancy.occupancyEndDate
            ? lotOccupancy.occupancyEndDateString
            : '<span class="has-text-grey">(No End Date)</span>') +
          '</td>') +
        ('<td>' +
          (lotOccupancy.lotOccupancyOccupants!.length === 0
            ? '<span class="has-text-grey">(No ' +
              los.escapedAliases.Occupants +
              ')</span>'
            : lotOccupancy.lotOccupancyOccupants?.reduce((soFar, occupant) => {
                return (
                  soFar +
                  '<span class="has-tooltip-left" data-tooltip="' +
                  cityssm.escapeHTML(occupant.lotOccupantType!) +
                  '">' +
                  '<i class="fas fa-fw fa-' +
                  cityssm.escapeHTML(
                    (occupant.fontAwesomeIconClass ?? '') === ''
                      ? 'user'
                      : occupant.fontAwesomeIconClass!
                  ) +
                  '" aria-label="' +
                  los.escapedAliases.Occupant +
                  '"></i> ' +
                  cityssm.escapeHTML(occupant.occupantName!) +
                  ' ' +
                  cityssm.escapeHTML(occupant.occupantFamilyName!) +
                  '</span><br />'
                )
              }, '')) +
          '</td>') +
        ('<td>' +
          '<button class="button is-small is-light is-danger button--deleteLotOccupancy" data-tooltip="Delete Relationship" type="button">' +
          '<i class="fas fa-trash" aria-hidden="true"></i>' +
          '</button>' +
          '</td>')
    )

    rowElement
      .querySelector('.button--addLot')
      ?.addEventListener('click', addLotFromLotOccupancy)

    rowElement
      .querySelector('.button--deleteLotOccupancy')!
      .addEventListener('click', deleteLotOccupancy)

    occupanciesContainerElement.querySelector('tbody')!.append(rowElement)
  }
}

function openEditLotStatus(clickEvent: Event): void {
  const lotId = Number.parseInt(
    (
      (clickEvent.currentTarget as HTMLElement).closest(
        '.container--lot'
      ) as HTMLElement
    ).dataset.lotId!,
    10
  )

  const lot = workOrderLots.find((possibleLot) => {
    return possibleLot.lotId === lotId
  })!

  let editCloseModalFunction: () => void

  function doUpdateLotStatus(submitEvent: SubmitEvent): void {
    submitEvent.preventDefault()

    cityssm.postJSON(
      los.urlPrefix + '/workOrders/doUpdateLotStatus',
      submitEvent.currentTarget,
      (responseJSON: {
        success: boolean
        errorMessage?: string
        workOrderLots?: recordTypes.Lot[]
      }) => {
        if (responseJSON.success) {
          workOrderLots = responseJSON.workOrderLots!
          renderRelatedLotsAndOccupancies()
          editCloseModalFunction()
        } else {
          bulmaJS.alert({
            title: 'Error Deleting Relationship',
            message: responseJSON.errorMessage ?? '',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  cityssm.openHtmlModal('lot-editLotStatus', {
    onshow(modalElement) {
      los.populateAliases(modalElement)
      ;(
        modalElement.querySelector('#lotStatusEdit--lotId') as HTMLInputElement
      ).value = lotId.toString()
      ;(
        modalElement.querySelector(
          '#lotStatusEdit--lotName'
        ) as HTMLInputElement
      ).value = lot.lotName!

      const lotStatusElement = modalElement.querySelector(
        '#lotStatusEdit--lotStatusId'
      ) as HTMLSelectElement

      let lotStatusFound = false

      for (const lotStatus of exports.lotStatuses as recordTypes.LotStatus[]) {
        const optionElement = document.createElement('option')
        optionElement.value = lotStatus.lotStatusId.toString()
        optionElement.textContent = lotStatus.lotStatus

        if (lotStatus.lotStatusId === lot.lotStatusId) {
          lotStatusFound = true
        }

        lotStatusElement.append(optionElement)
      }

      if (!lotStatusFound && lot.lotStatusId) {
        const optionElement = document.createElement('option')
        optionElement.value = lot.lotStatusId.toString()
        optionElement.textContent = lot.lotStatus!
        lotStatusElement.append(optionElement)
      }

      if (lot.lotStatusId) {
        lotStatusElement.value = lot.lotStatusId.toString()
      }

      modalElement
        .querySelector('form')!
        .insertAdjacentHTML(
          'beforeend',
          `<input name="workOrderId" type="hidden" value="${workOrderId}" />`
        )
    },
    onshown(modalElement, closeModalFunction) {
      editCloseModalFunction = closeModalFunction

      bulmaJS.toggleHtmlClipped()

      modalElement
        .querySelector('form')!
        .addEventListener('submit', doUpdateLotStatus)
    },
    onremoved() {
      bulmaJS.toggleHtmlClipped()
    }
  })
}

function deleteLot(clickEvent: Event): void {
  const lotId = (
    (clickEvent.currentTarget as HTMLElement).closest(
      '.container--lot'
    ) as HTMLElement
  ).dataset.lotId

  function doDelete(): void {
    cityssm.postJSON(
      los.urlPrefix + '/workOrders/doDeleteWorkOrderLot',
      {
        workOrderId,
        lotId
      },
      (responseJSON: {
        success: boolean
        errorMessage?: string
        workOrderLots?: recordTypes.Lot[]
      }) => {
        if (responseJSON.success) {
          workOrderLots = responseJSON.workOrderLots!
          renderRelatedLotsAndOccupancies()
        } else {
          bulmaJS.alert({
            title: 'Error Deleting Relationship',
            message: responseJSON.errorMessage ?? '',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  bulmaJS.confirm({
    title: `Delete ${los.escapedAliases.Occupancy} Relationship`,
    message: `Are you sure you want to remove the relationship to this ${los.escapedAliases.occupancy} record from this work order?  Note that the record will remain.`,
    contextualColorName: 'warning',
    okButton: {
      text: 'Yes, Delete Relationship',
      callbackFunction: doDelete
    }
  })
}

function renderRelatedLots(): void {
  const lotsContainerElement = document.querySelector(
    '#container--lots'
  ) as HTMLElement

  ;(
    document.querySelector(
      ".tabs a[href='#relatedTab--lots'] .tag"
    ) as HTMLElement
  ).textContent = workOrderLots.length.toString()

  if (workOrderLots.length === 0) {
    lotsContainerElement.innerHTML = `<div class="message is-info">
            <p class="message-body">There are no ${los.escapedAliases.lots} associated with this work order.</p>
            </div>`

    return
  }

  lotsContainerElement.innerHTML = `<table class="table is-fullwidth is-striped is-hoverable">
        <thead><tr>
        <th>${los.escapedAliases.Lot}</th>
        <th>${los.escapedAliases.Map}</th>
        <th>${los.escapedAliases.Lot} Type</th>
        <th>Status</th>
        <th class="has-width-1"></th>
        </tr></thead>
        <tbody></tbody>
        </table>`

  for (const lot of workOrderLots) {
    const rowElement = document.createElement('tr')
    rowElement.className = 'container--lot'

    rowElement.dataset.lotId = lot.lotId.toString()

    rowElement.innerHTML =
      '<td>' +
      '<a class="has-text-weight-bold" href="' +
      los.getLotURL(lot.lotId) +
      '">' +
      cityssm.escapeHTML(lot.lotName ?? '') +
      '</a>' +
      '</td>' +
      ('<td>' + cityssm.escapeHTML(lot.mapName ?? '') + '</td>') +
      ('<td>' + cityssm.escapeHTML(lot.lotType ?? '') + '</td>') +
      ('<td>' +
        (lot.lotStatusId
          ? cityssm.escapeHTML(lot.lotStatus ?? '')
          : '<span class="has-text-grey">(No Status)</span>') +
        '</td>') +
      ('<td class="is-nowrap">' +
        '<button class="button is-small is-light is-info button--editLotStatus" data-tooltip="Update Status" type="button">' +
        '<i class="fas fa-pencil-alt" aria-hidden="true"></i>' +
        '</button>' +
        ' <button class="button is-small is-light is-danger button--deleteLot" data-tooltip="Delete Relationship" type="button">' +
        '<i class="fas fa-trash" aria-hidden="true"></i>' +
        '</button>' +
        '</td>')

    rowElement
      .querySelector('.button--editLotStatus')!
      .addEventListener('click', openEditLotStatus)

    rowElement
      .querySelector('.button--deleteLot')!
      .addEventListener('click', deleteLot)

    lotsContainerElement.querySelector('tbody')!.append(rowElement)
  }
}

function renderRelatedLotsAndOccupancies(): void {
  renderRelatedOccupancies()
  renderRelatedLots()
}

renderRelatedLotsAndOccupancies()

function doAddLotOccupancy(clickEvent: Event): void {
  const rowElement = (clickEvent.currentTarget as HTMLElement).closest('tr')!

  const lotOccupancyId = rowElement.dataset.lotOccupancyId!

  addLotOccupancy(lotOccupancyId, (success) => {
    if (success) {
      rowElement.remove()
    }
  })
}

document
  .querySelector('#button--addLotOccupancy')
  ?.addEventListener('click', () => {
    let searchFormElement: HTMLFormElement
    let searchResultsContainerElement: HTMLElement

    function doSearch(event?: Event): void {
      if (event) {
        event.preventDefault()
      }

      searchResultsContainerElement.innerHTML =
        los.getLoadingParagraphHTML('Searching...')

      cityssm.postJSON(
        los.urlPrefix + '/lotOccupancies/doSearchLotOccupancies',
        searchFormElement,
        (responseJSON: { lotOccupancies: recordTypes.LotOccupancy[] }) => {
          if (responseJSON.lotOccupancies.length === 0) {
            searchResultsContainerElement.innerHTML = `<div class="message is-info">
              <p class="message-body">There are no records that meet the search criteria.</p>
              </div>`

            return
          }

          searchResultsContainerElement.innerHTML = `<table class="table is-fullwidth is-striped is-hoverable">
            <thead><tr>
            <th class="has-width-1"></th>
            <th>${los.escapedAliases.Occupancy} Type</th>
            <th>${los.escapedAliases.Lot}</th>
            <th>${los.escapedAliases.OccupancyStartDate}</th>
            <th>End Date</th>
            <th>${los.escapedAliases.Occupants}</th>
            </tr></thead>
            <tbody></tbody>
            </table>`

          for (const lotOccupancy of responseJSON.lotOccupancies) {
            const rowElement = document.createElement('tr')
            rowElement.className = 'container--lotOccupancy'
            rowElement.dataset.lotOccupancyId =
              lotOccupancy.lotOccupancyId!.toString()

            rowElement.innerHTML =
              '<td class="has-text-centered">' +
              '<button class="button is-small is-success button--addLotOccupancy" data-tooltip="Add" type="button" aria-label="Add">' +
              '<i class="fas fa-plus" aria-hidden="true"></i>' +
              '</button>' +
              '</td>' +
              ('<td class="has-text-weight-bold">' +
                cityssm.escapeHTML(lotOccupancy.occupancyType ?? '') +
                '</td>')

            if (lotOccupancy.lotId) {
              rowElement.insertAdjacentHTML(
                'beforeend',
                '<td>' +
                  cityssm.escapeHTML(lotOccupancy.lotName ?? '') +
                  '</td>'
              )
            } else {
              rowElement.insertAdjacentHTML(
                'beforeend',
                `<td><span class="has-text-grey">(No ${los.escapedAliases.Lot})</span></td>`
              )
            }

            rowElement.insertAdjacentHTML(
              'beforeend',
              `<td>${lotOccupancy.occupancyStartDateString!}</td>` +
                ('<td>' +
                  (lotOccupancy.occupancyEndDate
                    ? lotOccupancy.occupancyEndDateString!
                    : '<span class="has-text-grey">(No End Date)</span>') +
                  '</td>') +
                ('<td>' +
                  (lotOccupancy.lotOccupancyOccupants!.length === 0
                    ? `<span class="has-text-grey">(No ${cityssm.escapeHTML(
                        los.escapedAliases.Occupants
                      )})</span>`
                    : cityssm.escapeHTML(
                        lotOccupancy.lotOccupancyOccupants![0].occupantName! +
                          ' ' +
                          lotOccupancy.lotOccupancyOccupants![0]
                            .occupantFamilyName!
                      ) +
                      (lotOccupancy.lotOccupancyOccupants!.length > 1
                        ? ' plus ' +
                          (lotOccupancy.lotOccupancyOccupants!.length - 1)
                        : '')) +
                  '</td>')
            )

            rowElement
              .querySelector('.button--addLotOccupancy')!
              .addEventListener('click', doAddLotOccupancy)

            searchResultsContainerElement
              .querySelector('tbody')!
              .append(rowElement)
          }
        }
      )
    }

    cityssm.openHtmlModal('workOrder-addLotOccupancy', {
      onshow(modalElement) {
        los.populateAliases(modalElement)

        searchFormElement = modalElement.querySelector('form')!

        searchResultsContainerElement = modalElement.querySelector(
          '#resultsContainer--lotOccupancyAdd'
        ) as HTMLElement
        ;(
          modalElement.querySelector(
            '#lotOccupancySearch--notWorkOrderId'
          ) as HTMLInputElement
        ).value = workOrderId
        ;(
          modalElement.querySelector(
            '#lotOccupancySearch--occupancyEffectiveDateString'
          ) as HTMLInputElement
        ).value = (
          document.querySelector(
            '#workOrderEdit--workOrderOpenDateString'
          ) as HTMLInputElement
        ).value

        doSearch()
      },
      onshown(modalElement) {
        bulmaJS.toggleHtmlClipped()

        const occupantNameElement = modalElement.querySelector(
          '#lotOccupancySearch--occupantName'
        ) as HTMLInputElement

        occupantNameElement.addEventListener('change', doSearch)
        occupantNameElement.focus()
        ;(
          modalElement.querySelector(
            '#lotOccupancySearch--lotName'
          ) as HTMLInputElement
        ).addEventListener('change', doSearch)

        searchFormElement.addEventListener('submit', doSearch)
      },
      onremoved() {
        bulmaJS.toggleHtmlClipped()
        ;(
          document.querySelector(
            '#button--addLotOccupancy'
          ) as HTMLButtonElement
        ).focus()
      }
    })
  })

function doAddLot(clickEvent: Event): void {
  const rowElement = (clickEvent.currentTarget as HTMLElement).closest('tr')!

  const lotId = rowElement.dataset.lotId!

  addLot(lotId, (success) => {
    if (success) {
      rowElement.remove()
    }
  })
}

document.querySelector('#button--addLot')?.addEventListener('click', () => {
  let searchFormElement: HTMLFormElement
  let searchResultsContainerElement: HTMLElement

  function doSearch(event?: Event): void {
    if (event) {
      event.preventDefault()
    }

    searchResultsContainerElement.innerHTML =
      los.getLoadingParagraphHTML('Searching...')

    cityssm.postJSON(
      los.urlPrefix + '/lots/doSearchLots',
      searchFormElement,
      (responseJSON: { lots: recordTypes.Lot[] }) => {
        if (responseJSON.lots.length === 0) {
          searchResultsContainerElement.innerHTML =
            '<div class="message is-info">' +
            '<p class="message-body">There are no records that meet the search criteria.</p>' +
            '</div>'

          return
        }

        searchResultsContainerElement.innerHTML = `<table class="table is-fullwidth is-striped is-hoverable">
          <thead><tr>
          <th class="has-width-1"></th>
          <th>${los.escapedAliases.Lot}</th>
          <th>${los.escapedAliases.Map}</th>
          <th>${los.escapedAliases.Lot} Type</th>
          <th>Status</th>
          </tr></thead>
          <tbody></tbody>
          </table>`

        for (const lot of responseJSON.lots) {
          const rowElement = document.createElement('tr')
          rowElement.className = 'container--lot'
          rowElement.dataset.lotId = lot.lotId.toString()

          rowElement.innerHTML =
            '<td class="has-text-centered">' +
            '<button class="button is-small is-success button--addLot" data-tooltip="Add" type="button" aria-label="Add">' +
            '<i class="fas fa-plus" aria-hidden="true"></i>' +
            '</button>' +
            '</td>' +
            ('<td class="has-text-weight-bold">' +
              cityssm.escapeHTML(lot.lotName ?? '') +
              '</td>') +
            '<td>' +
            cityssm.escapeHTML(lot.mapName ?? '') +
            '</td>' +
            ('<td>' + cityssm.escapeHTML(lot.lotType ?? '') + '</td>') +
            ('<td>' + cityssm.escapeHTML(lot.lotStatus ?? '') + '</td>')

          rowElement
            .querySelector('.button--addLot')!
            .addEventListener('click', doAddLot)

          searchResultsContainerElement
            .querySelector('tbody')!
            .append(rowElement)
        }
      }
    )
  }

  cityssm.openHtmlModal('workOrder-addLot', {
    onshow(modalElement) {
      los.populateAliases(modalElement)

      searchFormElement = modalElement.querySelector('form')!

      searchResultsContainerElement = modalElement.querySelector(
        '#resultsContainer--lotAdd'
      ) as HTMLElement
      ;(
        modalElement.querySelector(
          '#lotSearch--notWorkOrderId'
        ) as HTMLInputElement
      ).value = workOrderId

      const lotStatusElement = modalElement.querySelector(
        '#lotSearch--lotStatusId'
      ) as HTMLSelectElement

      for (const lotStatus of exports.lotStatuses as recordTypes.LotStatus[]) {
        const optionElement = document.createElement('option')
        optionElement.value = lotStatus.lotStatusId.toString()
        optionElement.textContent = lotStatus.lotStatus
        lotStatusElement.append(optionElement)
      }

      doSearch()
    },
    onshown(modalElement) {
      bulmaJS.toggleHtmlClipped()

      const lotNameElement = modalElement.querySelector(
        '#lotSearch--lotName'
      ) as HTMLInputElement

      lotNameElement.addEventListener('change', doSearch)
      lotNameElement.focus()

      modalElement
        .querySelector('#lotSearch--lotStatusId')!
        .addEventListener('change', doSearch)

      searchFormElement.addEventListener('submit', doSearch)
    },
    onremoved() {
      bulmaJS.toggleHtmlClipped()
      ;(document.querySelector('#button--addLot') as HTMLButtonElement).focus()
    }
  })
})
