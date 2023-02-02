/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */

import type * as recordTypes from '../types/recordTypes'
import type * as globalTypes from '../types/globalTypes'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types'

declare const cityssm: cityssmGlobal
;(() => {
  const los = exports.los as globalTypes.LOS

  const workOrderPrints: string[] = exports.workOrderPrints

  const searchFilterFormElement = document.querySelector(
    '#form--searchFilters'
  ) as HTMLFormElement

  los.initializeDatePickers(searchFilterFormElement)

  const searchResultsContainerElement = document.querySelector(
    '#container--searchResults'
  ) as HTMLElement

  const limit = Number.parseInt(
    (document.querySelector('#searchFilter--limit') as HTMLInputElement).value,
    10
  )

  const offsetElement = document.querySelector(
    '#searchFilter--offset'
  ) as HTMLInputElement

  function renderWorkOrders(responseJSON: {
    count: number
    offset: number
    workOrders: recordTypes.WorkOrder[]
  }): void {
    if (responseJSON.workOrders.length === 0) {
      searchResultsContainerElement.innerHTML =
        '<div class="message is-info">' +
        '<p class="message-body">There are no work orders that meet the search criteria.</p>' +
        '</div>'

      return
    }

    const resultsTbodyElement = document.createElement('tbody')

    for (const workOrder of responseJSON.workOrders) {
      let relatedHTML = ''

      for (const lot of workOrder.workOrderLots!) {
        relatedHTML +=
          '<span class="has-tooltip-left" data-tooltip="' +
          cityssm.escapeHTML(lot.mapName ?? '') +
          '">' +
          '<i class="fas fa-fw fa-vector-square" aria-label="' +
          los.escapedAliases.Lot +
          '"></i> ' +
          cityssm.escapeHTML(
            (lot.lotName ?? '') === ''
              ? '(No ' + los.escapedAliases.Lot + ' Name)'
              : lot.lotName!
          ) +
          '</span><br />'
      }

      for (const occupancy of workOrder.workOrderLotOccupancies!) {
        for (const occupant of occupancy.lotOccupancyOccupants!) {
          relatedHTML +=
            '<span class="has-tooltip-left" data-tooltip="' +
            cityssm.escapeHTML(occupant.lotOccupantType ?? '') +
            '">' +
            '<i class="fas fa-fw fa-' +
            cityssm.escapeHTML(
              (occupant.fontAwesomeIconClass ?? '') === ''
                ? 'user'
                : occupant.fontAwesomeIconClass!
            ) +
            '" aria-label="' +
            los.escapedAliases.occupant +
            '"></i> ' +
            cityssm.escapeHTML(
              (occupant.occupantName ?? '') === '' && (occupant.occupantFamilyName ?? '') === ''
                ? '(No Name)'
                : occupant.occupantName! + ' ' + occupant.occupantFamilyName!
            ) +
            '</span><br />'
        }
      }

      resultsTbodyElement.insertAdjacentHTML(
        'beforeend',
        '<tr>' +
          ('<td>' +
            '<a class="has-text-weight-bold" href="' +
            los.getWorkOrderURL(workOrder.workOrderId) +
            '">' +
            (workOrder.workOrderNumber!.trim()
              ? cityssm.escapeHTML(workOrder.workOrderNumber ?? '')
              : '(No Number)') +
            '</a>' +
            '</td>') +
          ('<td>' +
            cityssm.escapeHTML(workOrder.workOrderType ?? '') +
            '<br />' +
            '<span class="is-size-7">' +
            cityssm.escapeHTML(workOrder.workOrderDescription ?? '') +
            '</span>' +
            '</td>') +
          ('<td class="is-nowrap"><span class="is-size-7">' +
            relatedHTML +
            '</span></td>') +
          ('<td class="is-nowrap">' +
            ('<span class="has-tooltip-left" data-tooltip="' +
              los.escapedAliases.WorkOrderOpenDate +
              '">' +
              '<i class="fas fa-fw fa-play" aria-label="' +
              los.escapedAliases.WorkOrderOpenDate +
              '"></i> ' +
              workOrder.workOrderOpenDateString +
              '</span><br />') +
            ('<span class="has-tooltip-left" data-tooltip="' +
              los.escapedAliases.WorkOrderCloseDate +
              '">' +
              '<i class="fas fa-fw fa-stop" aria-label="' +
              los.escapedAliases.WorkOrderCloseDate +
              '"></i> ' +
              (workOrder.workOrderCloseDate
                ? workOrder.workOrderCloseDateString
                : '<span class="has-text-grey">(No ' +
                  los.escapedAliases.WorkOrderCloseDate +
                  ')</span>') +
              '</span>') +
            '</td>') +
          ('<td>' +
            (workOrder.workOrderMilestoneCount === 0
              ? '-'
              : workOrder.workOrderMilestoneCompletionCount +
                ' / ' +
                workOrder.workOrderMilestoneCount) +
            '</td>') +
          (workOrderPrints.length > 0
            ? '<td>' +
              '<a class="button is-small" data-tooltip="Print" href="' +
              los.urlPrefix +
              '/print/' +
              workOrderPrints[0] +
              '/?workOrderId=' +
              workOrder.workOrderId +
              '" target="_blank">' +
              '<i class="fas fa-print" aria-label="Print"></i>' +
              '</a>' +
              '</td>'
            : '') +
          '</tr>'
      )
    }

    searchResultsContainerElement.innerHTML =
      '<table class="table is-fullwidth is-striped is-hoverable has-sticky-header">' +
      '<thead><tr>' +
      '<th>Work Order Number</th>' +
      '<th>Description</th>' +
      '<th>Related</th>' +
      '<th>Date</th>' +
      '<th class="has-tooltip-bottom" data-tooltip="Completed / Total Milestones">Progress</th>' +
      (workOrderPrints.length > 0 ? '<th class="has-width-1"></th>' : '') +
      '</tr></thead>' +
      '<table>'

    searchResultsContainerElement.insertAdjacentHTML(
      'beforeend',
      los.getSearchResultsPagerHTML(
        limit,
        responseJSON.offset,
        responseJSON.count
      )
    )

    searchResultsContainerElement
      .querySelector('table')!
      .append(resultsTbodyElement)

    searchResultsContainerElement
      .querySelector("button[data-page='previous']")
      ?.addEventListener('click', previousAndGetWorkOrders)

    searchResultsContainerElement
      .querySelector("button[data-page='next']")
      ?.addEventListener('click', nextAndGetWorkOrders)
  }

  function getWorkOrders(): void {
    searchResultsContainerElement.innerHTML = los.getLoadingParagraphHTML(
      'Loading Work Orders...'
    )

    cityssm.postJSON(
      los.urlPrefix + '/workOrders/doSearchWorkOrders',
      searchFilterFormElement,
      renderWorkOrders
    )
  }

  function resetOffsetAndGetWorkOrders(): void {
    offsetElement.value = '0'
    getWorkOrders()
  }

  function previousAndGetWorkOrders(): void {
    offsetElement.value = Math.max(
      Number.parseInt(offsetElement.value, 10) - limit,
      0
    ).toString()
    getWorkOrders()
  }

  function nextAndGetWorkOrders(): void {
    offsetElement.value = (
      Number.parseInt(offsetElement.value, 10) + limit
    ).toString()
    getWorkOrders()
  }

  const filterElements =
    searchFilterFormElement.querySelectorAll('input, select')

  for (const filterElement of filterElements) {
    filterElement.addEventListener('change', resetOffsetAndGetWorkOrders)
  }

  searchFilterFormElement.addEventListener('submit', (formEvent) => {
    formEvent.preventDefault()
  })

  /*
    const workOrderOpenDateStringElement = document.querySelector("#searchFilter--workOrderOpenDateString") as HTMLInputElement;

    document.querySelector("#button--workOrderOpenDateString-previous").addEventListener("click", () => {

        if (workOrderOpenDateStringElement.value === "") {
            workOrderOpenDateStringElement.valueAsDate = new Date();
        } else {
            const openDate = workOrderOpenDateStringElement.valueAsDate;
            openDate.setDate(openDate.getDate() - 1);
            workOrderOpenDateStringElement.valueAsDate = openDate;
        }

        resetOffsetAndGetWorkOrders();
    });

    document.querySelector("#button--workOrderOpenDateString-next").addEventListener("click", () => {

        if (workOrderOpenDateStringElement.value === "") {
            workOrderOpenDateStringElement.valueAsDate = new Date();
        } else {
            const openDate = workOrderOpenDateStringElement.valueAsDate;
            openDate.setDate(openDate.getDate() + 1);
            workOrderOpenDateStringElement.valueAsDate = openDate;
        }

        resetOffsetAndGetWorkOrders();
    });
    */

  getWorkOrders()
})()
