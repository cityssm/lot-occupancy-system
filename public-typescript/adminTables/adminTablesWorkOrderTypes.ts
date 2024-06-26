// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */

import type { BulmaJS } from '@cityssm/bulma-js/types.js'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types.js'

import type { LOS } from '../../types/globalTypes.js'
import type { WorkOrderType } from '../../types/recordTypes.js'

declare const cityssm: cityssmGlobal
declare const bulmaJS: BulmaJS

declare const los: LOS
declare const exports: Record<string, unknown>

let workOrderTypes = exports.workOrderTypes as WorkOrderType[]
delete exports.workOrderTypes

type ResponseJSON =
  | {
      success: true
      workOrderTypes: WorkOrderType[]
    }
  | {
      success: false
      errorMessage: string
    }

function updateWorkOrderType(submitEvent: SubmitEvent): void {
  submitEvent.preventDefault()

  cityssm.postJSON(
    `${los.urlPrefix}/admin/doUpdateWorkOrderType`,
    submitEvent.currentTarget,
    (rawResponseJSON) => {
      const responseJSON = rawResponseJSON as ResponseJSON

      if (responseJSON.success) {
        workOrderTypes = responseJSON.workOrderTypes

        bulmaJS.alert({
          message: 'Work Order Type Updated Successfully',
          contextualColorName: 'success'
        })
      } else {
        bulmaJS.alert({
          title: 'Error Updating Work Order Type',
          message: responseJSON.errorMessage ?? '',
          contextualColorName: 'danger'
        })
      }
    }
  )
}

function deleteWorkOrderType(clickEvent: Event): void {
  const tableRowElement = (clickEvent.currentTarget as HTMLElement).closest(
    'tr'
  ) as HTMLTableRowElement

  const workOrderTypeId = tableRowElement.dataset.workOrderTypeId

  function doDelete(): void {
    cityssm.postJSON(
      `${los.urlPrefix}/admin/doDeleteWorkOrderType`,
      {
        workOrderTypeId
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as ResponseJSON

        if (responseJSON.success) {
          workOrderTypes = responseJSON.workOrderTypes

          if (workOrderTypes.length === 0) {
            renderWorkOrderTypes()
          } else {
            tableRowElement.remove()
          }

          bulmaJS.alert({
            message: 'Work Order Type Deleted Successfully',
            contextualColorName: 'success'
          })
        } else {
          bulmaJS.alert({
            title: 'Error Deleting Work Order Type',
            message: responseJSON.errorMessage ?? '',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  bulmaJS.confirm({
    title: 'Delete Work Order Type',
    message: `Are you sure you want to delete this work order type?<br />
      Note that no work orders will be removed.`,
    messageIsHtml: true,
    contextualColorName: 'warning',
    okButton: {
      text: 'Yes, Delete Work Order Type',
      callbackFunction: doDelete
    }
  })
}

function moveWorkOrderType(clickEvent: MouseEvent): void {
  const buttonElement = clickEvent.currentTarget as HTMLButtonElement

  const tableRowElement = buttonElement.closest('tr') as HTMLTableRowElement

  const workOrderTypeId = tableRowElement.dataset.workOrderTypeId

  cityssm.postJSON(
    `${los.urlPrefix}/admin/${
      buttonElement.dataset.direction === 'up'
        ? 'doMoveWorkOrderTypeUp'
        : 'doMoveWorkOrderTypeDown'
    }`,
    {
      workOrderTypeId,
      moveToEnd: clickEvent.shiftKey ? '1' : '0'
    },
    (rawResponseJSON) => {
      const responseJSON = rawResponseJSON as ResponseJSON

      if (responseJSON.success) {
        workOrderTypes = responseJSON.workOrderTypes
        renderWorkOrderTypes()
      } else {
        bulmaJS.alert({
          title: 'Error Moving Work Order Type',
          message: responseJSON.errorMessage ?? '',
          contextualColorName: 'danger'
        })
      }
    }
  )
}

function renderWorkOrderTypes(): void {
  const containerElement = document.querySelector(
    '#container--workOrderTypes'
  ) as HTMLTableSectionElement

  if (workOrderTypes.length === 0) {
    containerElement.innerHTML = `<tr><td colspan="2">
      <div class="message is-warning"><p class="message-body">There are no active work order types.</p></div>
      </td></tr>`

    return
  }

  containerElement.innerHTML = ''

  for (const workOrderType of workOrderTypes) {
    const tableRowElement = document.createElement('tr')

    tableRowElement.dataset.workOrderTypeId =
      workOrderType.workOrderTypeId.toString()

    // eslint-disable-next-line no-unsanitized/property
    tableRowElement.innerHTML = `<td>
        <form>
          <input name="workOrderTypeId" type="hidden" value="${workOrderType.workOrderTypeId.toString()}" />
          <div class="field has-addons">
            <div class="control">
              <input class="input" name="workOrderType" type="text"
                value="${cityssm.escapeHTML(workOrderType.workOrderType ?? '')}" maxlength="100" aria-label="Work Order Type" required />
            </div>
            <div class="control">
              <button class="button is-success" type="submit" aria-label="Save">
                <i class="fas fa-save" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </form>
      </td><td class="is-nowrap">
        <div class="field is-grouped">
          <div class="control">
            ${los.getMoveUpDownButtonFieldHTML(
              'button--moveWorkOrderTypeUp',
              'button--moveWorkOrderTypeDown',
              false
            )}
          </div>
          <div class="control">
            <button class="button is-danger is-light button--deleteWorkOrderType" data-tooltip="Delete Work Order Type" type="button" aria-label="Delete Work Order Type">
              <i class="fas fa-trash" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </td>`

    tableRowElement
      .querySelector('form')
      ?.addEventListener('submit', updateWorkOrderType)
    ;(
      tableRowElement.querySelector(
        '.button--moveWorkOrderTypeUp'
      ) as HTMLButtonElement
    ).addEventListener('click', moveWorkOrderType)
    ;(
      tableRowElement.querySelector(
        '.button--moveWorkOrderTypeDown'
      ) as HTMLButtonElement
    ).addEventListener('click', moveWorkOrderType)

    tableRowElement
      .querySelector('.button--deleteWorkOrderType')
      ?.addEventListener('click', deleteWorkOrderType)

    containerElement.append(tableRowElement)
  }
}
;(
  document.querySelector('#form--addWorkOrderType') as HTMLFormElement
).addEventListener('submit', (submitEvent: SubmitEvent) => {
  submitEvent.preventDefault()

  const formElement = submitEvent.currentTarget as HTMLFormElement

  cityssm.postJSON(
    `${los.urlPrefix}/admin/doAddWorkOrderType`,
    formElement,
    (rawResponseJSON) => {
      const responseJSON = rawResponseJSON as ResponseJSON

      if (responseJSON.success) {
        workOrderTypes = responseJSON.workOrderTypes
        renderWorkOrderTypes()
        formElement.reset()
        formElement.querySelector('input')?.focus()
      } else {
        bulmaJS.alert({
          title: 'Error Adding Work Order Type',
          message: responseJSON.errorMessage ?? '',
          contextualColorName: 'danger'
        })
      }
    }
  )
})

renderWorkOrderTypes()
