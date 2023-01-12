/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */

import type * as globalTypes from '../types/globalTypes'
import type * as recordTypes from '../types/recordTypes'

import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types'

declare const cityssm: cityssmGlobal
;(() => {
  const los = exports.los as globalTypes.LOS

  const searchFilterFormElement = document.querySelector(
    '#form--searchFilters'
  ) as HTMLFormElement

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

  function renderLotOccupancies(responseJSON: {
    count: number
    offset: number
    lotOccupancies: recordTypes.LotOccupancy[]
  }): void {
    if (responseJSON.lotOccupancies.length === 0) {
      searchResultsContainerElement.innerHTML = `<div class="message is-info">
        <p class="message-body">
        There are no ${los.escapedAliases.occupancy} records that meet the search criteria.
        </p>
        </div>`

      return
    }

    const resultsTbodyElement = document.createElement('tbody')

    const nowDateString = cityssm.dateToString(new Date())

    for (const lotOccupancy of responseJSON.lotOccupancies) {
      let occupancyTimeHTML = ''

      if (
        lotOccupancy.occupancyStartDateString! <= nowDateString &&
        (lotOccupancy.occupancyEndDateString === '' ||
          lotOccupancy.occupancyEndDateString! >= nowDateString)
      ) {
        occupancyTimeHTML = `<span class="has-tooltip-right" data-tooltip="Current ${los.escapedAliases.Occupancy}">
          <i class="fas fa-play" aria-label="Current ${los.escapedAliases.Occupancy}"></i>
          </span>`
      } else if (lotOccupancy.occupancyStartDateString! > nowDateString) {
        occupancyTimeHTML = `<span class="has-tooltip-right" data-tooltip="Future ${los.escapedAliases.Occupancy}">
          <i class="fas fa-fast-forward" aria-label="Future ${los.escapedAliases.Occupancy}"></i>
          </span>`
      } else {
        occupancyTimeHTML = `<span class="has-tooltip-right" data-tooltip="Past ${los.escapedAliases.Occupancy}">
          <i class="fas fa-stop" aria-label="Past ${los.escapedAliases.Occupancy}"></i>
          </span>`
      }

      let occupantsHTML = ''

      for (const occupant of lotOccupancy.lotOccupancyOccupants!) {
        occupantsHTML +=
          '<span class="has-tooltip-left" data-tooltip="' +
          cityssm.escapeHTML(occupant.lotOccupantType ?? '') +
          '">' +
          ('<i class="fas fa-fw fa-' +
            cityssm.escapeHTML(
              (occupant.fontAwesomeIconClass ?? '') === ''
                ? 'user'
                : occupant.fontAwesomeIconClass!
            ) +
            '" aria-hidden="true"></i> ') +
          cityssm.escapeHTML(occupant.occupantName ?? '') +
          '</span><br />'
      }

      resultsTbodyElement.insertAdjacentHTML(
        'beforeend',
        '<tr>' +
          ('<td class="has-width-1">' + occupancyTimeHTML + '</td>') +
          ('<td>' +
            '<a class="has-text-weight-bold" href="' +
            los.getLotOccupancyURL(lotOccupancy.lotOccupancyId) +
            '">' +
            cityssm.escapeHTML(lotOccupancy.occupancyType as string) +
            '</a>' +
            '</td>') +
          ('<td>' +
            (lotOccupancy.lotName
              ? '<a class="has-tooltip-right" data-tooltip="' +
                cityssm.escapeHTML(lotOccupancy.lotType ?? '') +
                '" href="' +
                los.getLotURL(lotOccupancy.lotId) +
                '">' +
                cityssm.escapeHTML(lotOccupancy.lotName) +
                '</a>'
              : '<span class="has-text-grey">(No ' +
                los.escapedAliases.Lot +
                ')</span>') +
            '<br />' +
            ('<span class="is-size-7">' +
              cityssm.escapeHTML(lotOccupancy.mapName ?? '') +
              '</span>') +
            '</td>') +
          ('<td>' + lotOccupancy.occupancyStartDateString + '</td>') +
          ('<td>' +
            (lotOccupancy.occupancyEndDate
              ? lotOccupancy.occupancyEndDateString
              : '<span class="has-text-grey">(No End Date)</span>') +
            '</td>') +
          ('<td>' + occupantsHTML + '</td>') +
          '<td>' +
          (lotOccupancy.printEJS
            ? '<a class="button is-small" data-tooltip="Print" href="' +
              los.urlPrefix +
              '/print/' +
              lotOccupancy.printEJS +
              '/?lotOccupancyId=' +
              lotOccupancy.lotOccupancyId +
              '" target="_blank">' +
              '<i class="fas fa-print" aria-label="Print"></i>' +
              '</a>'
            : '') +
          '</td>' +
          '</tr>'
      )
    }

    searchResultsContainerElement.innerHTML = `<table class="table is-fullwidth is-striped is-hoverable has-sticky-header">
            <thead><tr>
            <th class="has-width-1"></th>
            <th>${los.escapedAliases.Occupancy} Type</th>
            <th>${los.escapedAliases.Lot}</th>
            <th>${los.escapedAliases.OccupancyStartDate}</th>
            <th>End Date</th>
            <th>${los.escapedAliases.Occupants}</th>
            <th class="has-width-1"><span class="is-sr-only">Print</span></th>
            </tr></thead>
            <table>`

    searchResultsContainerElement
      .querySelector('table')!
      .append(resultsTbodyElement)

    searchResultsContainerElement.insertAdjacentHTML(
      'beforeend',
      los.getSearchResultsPagerHTML(
        limit,
        responseJSON.offset,
        responseJSON.count
      )
    )

    searchResultsContainerElement
      .querySelector("button[data-page='previous']")
      ?.addEventListener('click', previousAndGetLotOccupancies)

    searchResultsContainerElement
      .querySelector("button[data-page='next']")
      ?.addEventListener('click', nextAndGetLotOccupancies)
  }

  function getLotOccupancies(): void {
    searchResultsContainerElement.innerHTML = los.getLoadingParagraphHTML(
      `Loading ${los.escapedAliases.Occupancies}...`
    )

    cityssm.postJSON(
      los.urlPrefix + '/lotOccupancies/doSearchLotOccupancies',
      searchFilterFormElement,
      renderLotOccupancies
    )
  }

  function resetOffsetAndGetLotOccupancies(): void {
    offsetElement.value = '0'
    getLotOccupancies()
  }

  function previousAndGetLotOccupancies(): void {
    offsetElement.value = Math.max(
      Number.parseInt(offsetElement.value, 10) - limit,
      0
    ).toString()
    getLotOccupancies()
  }

  function nextAndGetLotOccupancies(): void {
    offsetElement.value = (
      Number.parseInt(offsetElement.value, 10) + limit
    ).toString()
    getLotOccupancies()
  }

  const filterElements =
    searchFilterFormElement.querySelectorAll('input, select')

  for (const filterElement of filterElements) {
    filterElement.addEventListener('change', resetOffsetAndGetLotOccupancies)
  }

  searchFilterFormElement.addEventListener('submit', (formEvent) => {
    formEvent.preventDefault()
    resetOffsetAndGetLotOccupancies()
  })

  getLotOccupancies()
})()
