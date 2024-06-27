// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */

import type { BulmaJS } from '@cityssm/bulma-js/types.js'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types.js'

import type { LOS } from '../../types/globalTypes.js'
import type { LotOccupantType } from '../../types/recordTypes.js'

declare const cityssm: cityssmGlobal
declare const bulmaJS: BulmaJS

declare const los: LOS
declare const exports: Record<string, unknown>

declare const refreshFontAwesomeIcon: (changeEvent: Event) => void

let lotOccupantTypes = exports.lotOccupantTypes as LotOccupantType[]
delete exports.lotOccupantTypes

type ResponseJSON =
  | {
      success: true
      lotOccupantTypes: LotOccupantType[]
    }
  | {
      success: false
      errorMessage: string
    }

function updateLotOccupantType(submitEvent: SubmitEvent): void {
  submitEvent.preventDefault()

  cityssm.postJSON(
    `${los.urlPrefix}/admin/doUpdateLotOccupantType`,
    submitEvent.currentTarget,
    (rawResponseJSON) => {
      const responseJSON = rawResponseJSON as ResponseJSON

      if (responseJSON.success) {
        lotOccupantTypes = responseJSON.lotOccupantTypes

        bulmaJS.alert({
          message: `${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type Updated Successfully`,
          contextualColorName: 'success'
        })
      } else {
        bulmaJS.alert({
          title: `Error Updating ${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type`,
          message: responseJSON.errorMessage ?? '',
          contextualColorName: 'danger'
        })
      }
    }
  )
}

function deleteLotOccupantType(clickEvent: Event): void {
  const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest(
    'tr'
  ) as HTMLTableRowElement

  const lotOccupantTypeId = tableRowElement.dataset.lotOccupantTypeId

  function doDelete(): void {
    cityssm.postJSON(
      `${los.urlPrefix}/admin/doDeleteLotOccupantType`,
      {
        lotOccupantTypeId
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as ResponseJSON

        if (responseJSON.success) {
          lotOccupantTypes = responseJSON.lotOccupantTypes

          if (lotOccupantTypes.length === 0) {
            renderLotOccupantTypes()
          } else {
            tableRowElement.remove()
          }

          bulmaJS.alert({
            message: `${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type Deleted Successfully`,
            contextualColorName: 'success'
          })
        } else {
          bulmaJS.alert({
            title: `Error Deleting ${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type`,
            message: responseJSON.errorMessage ?? '',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  bulmaJS.confirm({
    title: `Delete ${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type`,
    message: `Are you sure you want to delete this ${los.escapedAliases.lot} ${los.escapedAliases.occupant} type?<br />
            Note that no ${los.escapedAliases.lot} ${los.escapedAliases.occupants} will be removed.`,
    messageIsHtml: true,
    contextualColorName: 'warning',
    okButton: {
      text: `Yes, Delete ${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type`,
      callbackFunction: doDelete
    }
  })
}

function moveLotOccupantType(clickEvent: MouseEvent): void {
  const buttonElement = clickEvent.currentTarget as HTMLButtonElement

  const tableRowElement = buttonElement.closest('tr') as HTMLTableRowElement

  const lotOccupantTypeId = tableRowElement.dataset.lotOccupantTypeId

  cityssm.postJSON(
    `${los.urlPrefix}/admin/${
      buttonElement.dataset.direction === 'up'
        ? 'doMoveLotOccupantTypeUp'
        : 'doMoveLotOccupantTypeDown'
    }`,
    {
      lotOccupantTypeId,
      moveToEnd: clickEvent.shiftKey ? '1' : '0'
    },
    (rawResponseJSON) => {
      const responseJSON = rawResponseJSON as ResponseJSON

      if (responseJSON.success) {
        lotOccupantTypes = responseJSON.lotOccupantTypes
        renderLotOccupantTypes()
      } else {
        bulmaJS.alert({
          title: `Error Moving ${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type`,
          message: responseJSON.errorMessage ?? '',
          contextualColorName: 'danger'
        })
      }
    }
  )
}

function renderLotOccupantTypes(): void {
  const containerElement = document.querySelector(
    '#container--lotOccupantTypes'
  ) as HTMLTableSectionElement

  if (lotOccupantTypes.length === 0) {
    // eslint-disable-next-line no-unsanitized/property
    containerElement.innerHTML = `<tr><td colspan="3">
      <div class="message is-warning">
      <p class="message-body">There are no active ${los.escapedAliases.lot} ${los.escapedAliases.occupant} types.</p>
      </div>
      </td></tr>`

    return
  }

  containerElement.innerHTML = ''

  for (const lotOccupantType of lotOccupantTypes) {
    const tableRowElement = document.createElement('tr')

    tableRowElement.dataset.lotOccupantTypeId =
      lotOccupantType.lotOccupantTypeId.toString()

    const formId = `form--lotOccupantType-${lotOccupantType.lotOccupantTypeId.toString()}`

    // eslint-disable-next-line no-unsanitized/property
    tableRowElement.innerHTML = `<td>
        <div class="field">
          <div class="control">
            <input class="input" name="lotOccupantType" type="text"
              value="${cityssm.escapeHTML(lotOccupantType.lotOccupantType)}"
              form="${formId}"
              aria-label="${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type" maxlength="100" required />
          </div>
        </div>
      </td><td>
        <div class="field has-addons">
          <div class="control">
            <span class="button is-static">fa-</span>
          </div>
          <div class="control">
            <input class="input" name="fontAwesomeIconClass" type="text"
              value="${cityssm.escapeHTML(lotOccupantType.fontAwesomeIconClass)}"
              form="${formId}"
              list="datalist--fontAwesomeIconClass" aria-label="Icon Name" maxlength="50" />
          </div>
          <div class="control">
            <span class="button is-static">
              <i class="fas fa-fw fa-${cityssm.escapeHTML(lotOccupantType.fontAwesomeIconClass)}"></i>
            </span>
          </div>
        </div>
      </td><td>
        <div class="field">
          <div class="control">
            <input class="input" name="occupantCommentTitle" type="text"
              value="${cityssm.escapeHTML(lotOccupantType.occupantCommentTitle)}"
              form="${formId}"
              aria-label="${los.escapedAliases.Occupant} Comment Title" maxlength="50" />
          </div>
        </div>
      </td><td>
        <form id="${formId}">
          <input name="lotOccupantTypeId" type="hidden"
            value="${lotOccupantType.lotOccupantTypeId.toString()}" />
          <button class="button is-success" type="submit" aria-label="Save">
            <i class="fas fa-save" aria-hidden="true"></i>
          </button>
        </form>
      </td><td class="is-nowrap">
        <div class="field is-grouped">
          <div class="control">
            ${los.getMoveUpDownButtonFieldHTML(
              'button--moveLotOccupantTypeUp',
              'button--moveLotOccupantTypeDown',
              false
            )}
          </div>
          <div class="control">
            <button class="button is-danger is-light button--deleteLotOccupantType"
              data-tooltip="Delete ${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type"
              type="button"
              aria-label="Delete ${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type">
              <i class="fas fa-trash" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </td>`

    const fontAwesomeInputElement = tableRowElement.querySelector(
      "input[name='fontAwesomeIconClass']"
    ) as HTMLInputElement

    fontAwesomeInputElement.addEventListener('keyup', refreshFontAwesomeIcon)
    fontAwesomeInputElement.addEventListener('change', refreshFontAwesomeIcon)

    tableRowElement
      .querySelector('form')
      ?.addEventListener('submit', updateLotOccupantType)
    ;(
      tableRowElement.querySelector(
        '.button--moveLotOccupantTypeUp'
      ) as HTMLButtonElement
    ).addEventListener('click', moveLotOccupantType)
    ;(
      tableRowElement.querySelector(
        '.button--moveLotOccupantTypeDown'
      ) as HTMLButtonElement
    ).addEventListener('click', moveLotOccupantType)

    tableRowElement
      .querySelector('.button--deleteLotOccupantType')
      ?.addEventListener('click', deleteLotOccupantType)

    containerElement.append(tableRowElement)
  }
}
;(
  document.querySelector('#form--addLotOccupantType') as HTMLFormElement
).addEventListener('submit', (submitEvent: SubmitEvent) => {
  submitEvent.preventDefault()

  const formElement = submitEvent.currentTarget as HTMLFormElement

  cityssm.postJSON(
    `${los.urlPrefix}/admin/doAddLotOccupantType`,
    formElement,
    (rawResponseJSON) => {
      const responseJSON = rawResponseJSON as ResponseJSON

      if (responseJSON.success) {
        lotOccupantTypes = responseJSON.lotOccupantTypes
        renderLotOccupantTypes()
        formElement.reset()
        formElement.querySelector('input')?.focus()
      } else {
        bulmaJS.alert({
          title: `Error Adding ${los.escapedAliases.Lot} ${los.escapedAliases.Occupant} Type`,
          message: responseJSON.errorMessage ?? '',
          contextualColorName: 'danger'
        })
      }
    }
  )
})

renderLotOccupantTypes()
