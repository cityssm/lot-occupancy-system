/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */

import type * as globalTypes from '../types/globalTypes'

import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types'
import type { BulmaJS } from '@cityssm/bulma-js/types'

declare const cityssm: cityssmGlobal
declare const bulmaJS: BulmaJS
;(() => {
  const los = exports.los as globalTypes.LOS

  const mapId = (document.querySelector('#map--mapId') as HTMLInputElement)
    .value
  const isCreate = mapId === ''

  const mapForm = document.querySelector('#form--map') as HTMLFormElement

  function updateMap(formEvent: SubmitEvent): void {
    formEvent.preventDefault()

    cityssm.postJSON(
      los.urlPrefix + '/maps/' + (isCreate ? 'doCreateMap' : 'doUpdateMap'),
      mapForm,
      (responseJSON: {
        success: boolean
        mapId?: number
        errorMessage?: string
      }) => {
        if (responseJSON.success) {
          cityssm.disableNavBlocker()

          if (isCreate) {
            window.location.href = los.getMapURL(responseJSON.mapId, true)
          } else {
            bulmaJS.alert({
              message: los.escapedAliases.Map + ' Updated Successfully',
              contextualColorName: 'success'
            })
          }
        } else {
          bulmaJS.alert({
            title: 'Error Updating ' + los.escapedAliases.Map,
            message: responseJSON.errorMessage ?? '',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  mapForm.addEventListener('submit', updateMap)

  const inputElements: NodeListOf<HTMLInputElement | HTMLSelectElement> =
    mapForm.querySelectorAll('input, select')

  for (const inputElement of inputElements) {
    inputElement.addEventListener('change', cityssm.enableNavBlocker)
  }

  document
    .querySelector('#button--deleteMap')
    ?.addEventListener('click', (clickEvent) => {
      clickEvent.preventDefault()

      function doDelete(): void {
        cityssm.postJSON(
          los.urlPrefix + '/maps/doDeleteMap',
          {
            mapId
          },
          (responseJSON: { success: boolean; errorMessage?: string }) => {
            if (responseJSON.success) {
              window.location.href = los.getMapURL()
            } else {
              bulmaJS.alert({
                title: 'Error Deleting ' + los.escapedAliases.Map,
                message: responseJSON.errorMessage ?? '',
                contextualColorName: 'danger'
              })
            }
          }
        )
      }

      bulmaJS.confirm({
        title: 'Delete ' + los.escapedAliases.Map,
        message: `Are you sure you want to delete this ${los.escapedAliases.map} and all related ${los.escapedAliases.lots}?`,
        contextualColorName: 'warning',
        okButton: {
          text: `Yes, Delete ${los.escapedAliases.Map}`,
          callbackFunction: doDelete
        }
      })
    })
})()
