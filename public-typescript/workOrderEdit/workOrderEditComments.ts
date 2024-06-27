// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */

import type { BulmaJS } from '@cityssm/bulma-js/types.js'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types.js'

import type { LOS } from '../../types/globalTypes.js'
import type { WorkOrderComment } from '../../types/recordTypes.js'

declare const cityssm: cityssmGlobal
declare const bulmaJS: BulmaJS

declare const exports: Record<string, unknown>
declare const los: LOS

declare const workOrderId: string
declare const isCreate: boolean

let workOrderComments =
  exports.workOrderComments as WorkOrderComment[]
delete exports.workOrderComments

function openEditWorkOrderComment(clickEvent: Event): void {
  const workOrderCommentId = Number.parseInt(
    (clickEvent.currentTarget as HTMLElement).closest('tr')?.dataset
      .workOrderCommentId ?? '',
    10
  )

  const workOrderComment = workOrderComments.find((currentComment) => {
    return currentComment.workOrderCommentId === workOrderCommentId
  }) as WorkOrderComment

  let editFormElement: HTMLFormElement
  let editCloseModalFunction: () => void

  function editComment(submitEvent: SubmitEvent): void {
    submitEvent.preventDefault()

    cityssm.postJSON(
      `${los.urlPrefix}/workOrders/doUpdateWorkOrderComment`,
      editFormElement,
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          success: boolean
          errorMessage?: string
          workOrderComments: WorkOrderComment[]
        }

        if (responseJSON.success) {
          workOrderComments = responseJSON.workOrderComments
          editCloseModalFunction()
          renderWorkOrderComments()
        } else {
          bulmaJS.alert({
            title: 'Error Updating Comment',
            message: responseJSON.errorMessage ?? '',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  cityssm.openHtmlModal('workOrder-editComment', {
    onshow(modalElement) {
      ;(
        modalElement.querySelector(
          '#workOrderCommentEdit--workOrderId'
        ) as HTMLInputElement
      ).value = workOrderId
      ;(
        modalElement.querySelector(
          '#workOrderCommentEdit--workOrderCommentId'
        ) as HTMLInputElement
      ).value = workOrderCommentId.toString()
      ;(
        modalElement.querySelector(
          '#workOrderCommentEdit--workOrderComment'
        ) as HTMLInputElement
      ).value = workOrderComment.workOrderComment ?? ''

      const workOrderCommentDateStringElement = modalElement.querySelector(
        '#workOrderCommentEdit--workOrderCommentDateString'
      ) as HTMLInputElement

      workOrderCommentDateStringElement.value =
        workOrderComment.workOrderCommentDateString ?? ''

      const currentDateString = cityssm.dateToString(new Date())

      workOrderCommentDateStringElement.max =
        workOrderComment.workOrderCommentDateString! <= currentDateString
          ? currentDateString
          : workOrderComment.workOrderCommentDateString ?? ''
      ;(
        modalElement.querySelector(
          '#workOrderCommentEdit--workOrderCommentTimeString'
        ) as HTMLInputElement
      ).value = workOrderComment.workOrderCommentTimeString ?? ''
    },
    onshown(modalElement, closeModalFunction) {
      bulmaJS.toggleHtmlClipped()

      los.initializeDatePickers(modalElement)
      ;(
        modalElement.querySelector(
          '#workOrderCommentEdit--workOrderComment'
        ) as HTMLTextAreaElement
      ).focus()

      editFormElement = modalElement.querySelector('form') as HTMLFormElement
      editFormElement.addEventListener('submit', editComment)

      editCloseModalFunction = closeModalFunction
    },
    onremoved() {
      bulmaJS.toggleHtmlClipped()
    }
  })
}

function deleteWorkOrderComment(clickEvent: Event): void {
  const workOrderCommentId = Number.parseInt(
    (clickEvent.currentTarget as HTMLElement).closest('tr')?.dataset
      .workOrderCommentId ?? '',
    10
  )

  function doDelete(): void {
    cityssm.postJSON(
      `${los.urlPrefix}/workOrders/doDeleteWorkOrderComment`,
      {
        workOrderId,
        workOrderCommentId
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          success: boolean
          errorMessage?: string
          workOrderComments: WorkOrderComment[]
        }

        if (responseJSON.success) {
          workOrderComments = responseJSON.workOrderComments
          renderWorkOrderComments()
        } else {
          bulmaJS.alert({
            title: 'Error Removing Comment',
            message: responseJSON.errorMessage ?? '',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  bulmaJS.confirm({
    title: 'Remove Comment?',
    message: 'Are you sure you want to remove this comment?',
    okButton: {
      text: 'Yes, Remove Comment',
      callbackFunction: doDelete
    },
    contextualColorName: 'warning'
  })
}

function renderWorkOrderComments(): void {
  const containerElement = document.querySelector(
    '#container--workOrderComments'
  ) as HTMLElement

  if (workOrderComments.length === 0) {
    containerElement.innerHTML = `<div class="message is-info">
      <p class="message-body">There are no comments to display.</p>
      </div>`
    return
  }

  const tableElement = document.createElement('table')
  tableElement.className = 'table is-fullwidth is-striped is-hoverable'
  tableElement.innerHTML = `<thead><tr>
    <th>Commentor</th>
    <th>Comment Date</th>
    <th>Comment</th>
    <th class="is-hidden-print"><span class="is-sr-only">Options</span></th></tr></thead><tbody></tbody>`

  for (const workOrderComment of workOrderComments) {
    const tableRowElement = document.createElement('tr')

    tableRowElement.dataset.workOrderCommentId =
      workOrderComment.workOrderCommentId?.toString()

    // eslint-disable-next-line no-unsanitized/property
    tableRowElement.innerHTML = `<td>
        ${cityssm.escapeHTML(workOrderComment.recordCreate_userName ?? '')}
      </td><td>
        ${workOrderComment.workOrderCommentDateString}
        ${
          workOrderComment.workOrderCommentTime === 0
            ? ''
            : workOrderComment.workOrderCommentTimePeriodString
        }
      </td><td>
        ${cityssm.escapeHTML(workOrderComment.workOrderComment ?? '')}
      </td><td class="is-hidden-print">
        <div class="buttons are-small is-justify-content-end">
          <button class="button is-primary button--edit" type="button">
            <span class="icon is-small"><i class="fas fa-pencil-alt" aria-hidden="true"></i></span>
            <span>Edit</span>
          </button>
          <button class="button is-light is-danger button--delete" data-tooltip="Delete Comment" type="button" aria-label="Delete">
            <i class="fas fa-trash" aria-hidden="true"></i>
          </button>
        </div>
      </td>`

    tableRowElement
      .querySelector('.button--edit')
      ?.addEventListener('click', openEditWorkOrderComment)

    tableRowElement
      .querySelector('.button--delete')
      ?.addEventListener('click', deleteWorkOrderComment)

    tableElement.querySelector('tbody')?.append(tableRowElement)
  }

  containerElement.innerHTML = ''
  containerElement.append(tableElement)
}

function openAddCommentModal(): void {
  let addCommentCloseModalFunction: () => void

  function doAddComment(formEvent: SubmitEvent): void {
    formEvent.preventDefault()

    cityssm.postJSON(
      `${los.urlPrefix}/workOrders/doAddWorkOrderComment`,
      formEvent.currentTarget,
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          success: boolean
          workOrderComments: WorkOrderComment[]
        }

        if (responseJSON.success) {
          workOrderComments = responseJSON.workOrderComments
          renderWorkOrderComments()
          addCommentCloseModalFunction()
        }
      }
    )
  }

  cityssm.openHtmlModal('workOrder-addComment', {
    onshow(modalElement) {
      los.populateAliases(modalElement)
      ;(
        modalElement.querySelector(
          '#workOrderCommentAdd--workOrderId'
        ) as HTMLInputElement
      ).value = workOrderId

      modalElement
        .querySelector('form')
        ?.addEventListener('submit', doAddComment)
    },
    onshown(modalElement, closeModalFunction) {
      bulmaJS.toggleHtmlClipped()
      addCommentCloseModalFunction = closeModalFunction
      ;(
        modalElement.querySelector(
          '#workOrderCommentAdd--workOrderComment'
        ) as HTMLTextAreaElement
      ).focus()
    },
    onremoved() {
      bulmaJS.toggleHtmlClipped()
      ;(
        document.querySelector('#workOrderComments--add') as HTMLButtonElement
      ).focus()
    }
  })
}

document
  .querySelector('#workOrderComments--add')
  ?.addEventListener('click', openAddCommentModal)

if (!isCreate) {
  renderWorkOrderComments()
}
