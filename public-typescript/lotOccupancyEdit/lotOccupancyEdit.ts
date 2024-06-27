/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable unicorn/prefer-module */

import type { BulmaJS } from '@cityssm/bulma-js/types.js'
import type { cityssmGlobal } from '@cityssm/bulma-webapp-js/src/types.js'

import type { LOS } from '../../types/globalTypes.js'
import type { Lot, LotStatus, LotType, MapRecord, OccupancyTypeField, WorkOrderType } from '../../types/recordTypes.js'

declare const cityssm: cityssmGlobal
declare const bulmaJS: BulmaJS
declare const exports: Record<string, unknown>
;(() => {
  const los = exports.los as LOS

  const lotOccupancyId = (
    document.querySelector('#lotOccupancy--lotOccupancyId') as HTMLInputElement
  ).value
  const isCreate = lotOccupancyId === ''

  /*
   * Main form
   */

  let refreshAfterSave = isCreate

  function setUnsavedChanges(): void {
    los.setUnsavedChanges()
    document
      .querySelector("button[type='submit'][form='form--lotOccupancy']")
      ?.classList.remove('is-light')
  }

  function clearUnsavedChanges(): void {
    los.clearUnsavedChanges()
    document
      .querySelector("button[type='submit'][form='form--lotOccupancy']")
      ?.classList.add('is-light')
  }

  const formElement = document.querySelector(
    '#form--lotOccupancy'
  ) as HTMLFormElement

  formElement.addEventListener('submit', (formEvent) => {
    formEvent.preventDefault()

    cityssm.postJSON(
      `${los.urlPrefix}/lotOccupancies/${isCreate ? 'doCreateLotOccupancy' : 'doUpdateLotOccupancy'}`,
      formElement,
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          success: boolean
          lotOccupancyId?: number
          errorMessage?: string
        }

        if (responseJSON.success) {
          clearUnsavedChanges()

          if (isCreate || refreshAfterSave) {
            window.location.href = los.getLotOccupancyURL(
              responseJSON.lotOccupancyId,
              true,
              true
            )
          } else {
            bulmaJS.alert({
              message: `${los.escapedAliases.Occupancy} Updated Successfully`,
              contextualColorName: 'success'
            })
          }
        } else {
          bulmaJS.alert({
            title: `Error Saving ${los.escapedAliases.Occupancy}`,
            message: responseJSON.errorMessage ?? '',
            contextualColorName: 'danger'
          })
        }
      }
    )
  })

  const formInputElements = formElement.querySelectorAll('input, select')

  for (const formInputElement of formInputElements) {
    formInputElement.addEventListener('change', setUnsavedChanges)
  }

  function doCopy(): void {
    cityssm.postJSON(
      `${los.urlPrefix}/lotOccupancies/doCopyLotOccupancy`,
      {
        lotOccupancyId
      },
      (rawResponseJSON) => {
        const responseJSON = rawResponseJSON as {
          success: boolean
          errorMessage?: string
          lotOccupancyId?: number
        }

        if (responseJSON.success) {
          clearUnsavedChanges()

          window.location.href = los.getLotOccupancyURL(
            responseJSON.lotOccupancyId,
            true
          )
        } else {
          bulmaJS.alert({
            title: 'Error Copying Record',
            message: responseJSON.errorMessage ?? '',
            contextualColorName: 'danger'
          })
        }
      }
    )
  }

  document
    .querySelector('#button--copyLotOccupancy')
    ?.addEventListener('click', (clickEvent) => {
      clickEvent.preventDefault()

      if (los.hasUnsavedChanges()) {
        bulmaJS.alert({
          title: 'Unsaved Changes',
          message: 'Please save all unsaved changes before continuing.',
          contextualColorName: 'warning'
        })
      } else {
        bulmaJS.confirm({
          title: `Copy ${los.escapedAliases.Occupancy} Record as New`,
          message: 'Are you sure you want to copy this record to a new record?',
          contextualColorName: 'info',
          okButton: {
            text: 'Yes, Copy',
            callbackFunction: doCopy
          }
        })
      }
    })

  document
    .querySelector('#button--deleteLotOccupancy')
    ?.addEventListener('click', (clickEvent) => {
      clickEvent.preventDefault()

      function doDelete(): void {
        cityssm.postJSON(
          `${los.urlPrefix}/lotOccupancies/doDeleteLotOccupancy`,
          {
            lotOccupancyId
          },
          (rawResponseJSON) => {
            const responseJSON = rawResponseJSON as {
              success: boolean
              errorMessage?: string
            }

            if (responseJSON.success) {
              clearUnsavedChanges()
              window.location.href = los.getLotOccupancyURL()
            } else {
              bulmaJS.alert({
                title: 'Error Deleting Record',
                message: responseJSON.errorMessage ?? '',
                contextualColorName: 'danger'
              })
            }
          }
        )
      }

      bulmaJS.confirm({
        title: `Delete ${los.escapedAliases.Occupancy} Record`,
        message: 'Are you sure you want to delete this record?',
        contextualColorName: 'warning',
        okButton: {
          text: 'Yes, Delete',
          callbackFunction: doDelete
        }
      })
    })

  document
    .querySelector('#button--createWorkOrder')
    ?.addEventListener('click', (clickEvent) => {
      clickEvent.preventDefault()

      let createCloseModalFunction: () => void

      function doCreate(formEvent: SubmitEvent): void {
        formEvent.preventDefault()

        cityssm.postJSON(
          `${los.urlPrefix}/workOrders/doCreateWorkOrder`,
          formEvent.currentTarget,
          (rawResponseJSON) => {
            const responseJSON = rawResponseJSON as {
              success: boolean
              errorMessage?: string
              workOrderId?: number
            }

            if (responseJSON.success) {
              createCloseModalFunction()

              bulmaJS.confirm({
                title: 'Work Order Created Successfully',
                message: 'Would you like to open the work order now?',
                contextualColorName: 'success',
                okButton: {
                  text: 'Yes, Open the Work Order',
                  callbackFunction: () => {
                    window.location.href = los.getWorkOrderURL(
                      responseJSON.workOrderId,
                      true
                    )
                  }
                }
              })
            } else {
              bulmaJS.alert({
                title: 'Error Creating Work Order',
                message: responseJSON.errorMessage as string,
                contextualColorName: 'danger'
              })
            }
          }
        )
      }

      cityssm.openHtmlModal('lotOccupancy-createWorkOrder', {
        onshow(modalElement) {
          ;(
            modalElement.querySelector(
              '#workOrderCreate--lotOccupancyId'
            ) as HTMLInputElement
          ).value = lotOccupancyId
          ;(
            modalElement.querySelector(
              '#workOrderCreate--workOrderOpenDateString'
            ) as HTMLInputElement
          ).value = cityssm.dateToString(new Date())

          const workOrderTypeSelectElement = modalElement.querySelector(
            '#workOrderCreate--workOrderTypeId'
          ) as HTMLSelectElement

          const workOrderTypes = (exports as Record<string, unknown>)
            .workOrderTypes as WorkOrderType[]

          if (workOrderTypes.length === 1) {
            workOrderTypeSelectElement.innerHTML = ''
          }

          for (const workOrderType of workOrderTypes) {
            const optionElement = document.createElement('option')
            optionElement.value = workOrderType.workOrderTypeId.toString()
            optionElement.textContent = workOrderType.workOrderType ?? ''
            workOrderTypeSelectElement.append(optionElement)
          }
        },
        onshown(modalElement, closeModalFunction) {
          createCloseModalFunction = closeModalFunction
          bulmaJS.toggleHtmlClipped()
          ;(
            modalElement.querySelector(
              '#workOrderCreate--workOrderTypeId'
            ) as HTMLSelectElement
          ).focus()

          modalElement
            .querySelector('form')
            ?.addEventListener('submit', doCreate)
        },
        onremoved() {
          bulmaJS.toggleHtmlClipped()
          ;(
            document.querySelector(
              '#button--createWorkOrder'
            ) as HTMLButtonElement
          ).focus()
        }
      })
    })

  // Occupancy Type

  const occupancyTypeIdElement = document.querySelector(
    '#lotOccupancy--occupancyTypeId'
  ) as HTMLSelectElement

  if (isCreate) {
    const lotOccupancyFieldsContainerElement = document.querySelector(
      '#container--lotOccupancyFields'
    ) as HTMLElement

    occupancyTypeIdElement.addEventListener('change', () => {
      if (occupancyTypeIdElement.value === '') {
        // eslint-disable-next-line no-unsanitized/property
        lotOccupancyFieldsContainerElement.innerHTML = `<div class="message is-info">
          <p class="message-body">Select the ${los.escapedAliases.occupancy} type to load the available fields.</p>
          </div>`

        return
      }

      cityssm.postJSON(
        `${los.urlPrefix}/lotOccupancies/doGetOccupancyTypeFields`,
        {
          occupancyTypeId: occupancyTypeIdElement.value
        },
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            occupancyTypeFields: OccupancyTypeField[]
          }

          if (responseJSON.occupancyTypeFields.length === 0) {
            // eslint-disable-next-line no-unsanitized/property
            lotOccupancyFieldsContainerElement.innerHTML = `<div class="message is-info">
              <p class="message-body">There are no additional fields for this ${los.escapedAliases.occupancy} type.</p>
              </div>`

            return
          }

          lotOccupancyFieldsContainerElement.innerHTML = ''

          let occupancyTypeFieldIds = ''

          for (const occupancyTypeField of responseJSON.occupancyTypeFields) {
            occupancyTypeFieldIds +=
              ',' + occupancyTypeField.occupancyTypeFieldId.toString()

            const fieldName = `lotOccupancyFieldValue_${occupancyTypeField.occupancyTypeFieldId.toString()}`

            const fieldId = `lotOccupancy--${fieldName}`

            const fieldElement = document.createElement('div')
            fieldElement.className = 'field'
            fieldElement.innerHTML = `<label class="label" for="${cityssm.escapeHTML(fieldId)}"></label><div class="control"></div>`
            ;(
              fieldElement.querySelector('label') as HTMLLabelElement
            ).textContent = occupancyTypeField.occupancyTypeField as string

            if ((occupancyTypeField.occupancyTypeFieldValues ?? '') === '') {
              const inputElement = document.createElement('input')

              inputElement.className = 'input'

              inputElement.id = fieldId

              inputElement.name = fieldName

              inputElement.type = 'text'

              inputElement.required = occupancyTypeField.isRequired as boolean
              inputElement.minLength =
                occupancyTypeField.minimumLength as number
              inputElement.maxLength =
                occupancyTypeField.maximumLength as number

              if ((occupancyTypeField.pattern ?? '') !== '') {
                inputElement.pattern = occupancyTypeField.pattern as string
              }

              ;(fieldElement.querySelector('.control') as HTMLElement).append(
                inputElement
              )
            } else {
              ;(
                fieldElement.querySelector('.control') as HTMLElement
              ).innerHTML = `<div class="select is-fullwidth">
                  <select id="${cityssm.escapeHTML(fieldId)}" name="${cityssm.escapeHTML(fieldName)}">
                  <option value="">(Not Set)</option>
                  </select>
                  </div>`

              const selectElement = fieldElement.querySelector(
                'select'
              ) as HTMLSelectElement

              selectElement.required = occupancyTypeField.isRequired as boolean

              const optionValues = (
                occupancyTypeField.occupancyTypeFieldValues as string
              ).split('\n')

              for (const optionValue of optionValues) {
                const optionElement = document.createElement('option')
                optionElement.value = optionValue
                optionElement.textContent = optionValue
                selectElement.append(optionElement)
              }
            }

            console.log(fieldElement)

            lotOccupancyFieldsContainerElement.append(fieldElement)
          }

          lotOccupancyFieldsContainerElement.insertAdjacentHTML(
            'beforeend',
            // eslint-disable-next-line no-secrets/no-secrets
            `<input name="occupancyTypeFieldIds" type="hidden"
              value="${cityssm.escapeHTML(occupancyTypeFieldIds.slice(1))}" />`
          )
        }
      )
    })
  } else {
    const originalOccupancyTypeId = occupancyTypeIdElement.value

    occupancyTypeIdElement.addEventListener('change', () => {
      if (occupancyTypeIdElement.value !== originalOccupancyTypeId) {
        bulmaJS.confirm({
          title: 'Confirm Change',
          message: `Are you sure you want to change the ${los.escapedAliases.occupancy} type?\n
            This change affects the additional fields associated with this record, and may also affect the available fees.`,
          contextualColorName: 'warning',
          okButton: {
            text: 'Yes, Keep the Change',
            callbackFunction: () => {
              refreshAfterSave = true
            }
          },
          cancelButton: {
            text: 'Revert the Change',
            callbackFunction: () => {
              occupancyTypeIdElement.value = originalOccupancyTypeId
            }
          }
        })
      }
    })
  }

  // Lot Selector

  const lotNameElement = document.querySelector(
    '#lotOccupancy--lotName'
  ) as HTMLInputElement

  lotNameElement.addEventListener('click', (clickEvent) => {
    const currentLotName = (clickEvent.currentTarget as HTMLInputElement).value

    let lotSelectCloseModalFunction: () => void
    let lotSelectModalElement: HTMLElement

    let lotSelectFormElement: HTMLFormElement
    let lotSelectResultsElement: HTMLElement

    function renderSelectedLotAndClose(
      lotId: number | string,
      lotName: string
    ): void {
      ;(
        document.querySelector('#lotOccupancy--lotId') as HTMLInputElement
      ).value = lotId.toString()
      ;(
        document.querySelector('#lotOccupancy--lotName') as HTMLInputElement
      ).value = lotName

      setUnsavedChanges()
      lotSelectCloseModalFunction()
    }

    function selectExistingLot(clickEvent: Event): void {
      clickEvent.preventDefault()

      const selectedLotElement = clickEvent.currentTarget as HTMLElement

      renderSelectedLotAndClose(
        selectedLotElement.dataset.lotId ?? '',
        selectedLotElement.dataset.lotName ?? ''
      )
    }

    function searchLots(): void {
      // eslint-disable-next-line no-unsanitized/property
      lotSelectResultsElement.innerHTML =
        los.getLoadingParagraphHTML('Searching...')

      cityssm.postJSON(
        `${los.urlPrefix}/lots/doSearchLots`,
        lotSelectFormElement,
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            count: number
            lots: Lot[]
          }

          if (responseJSON.count === 0) {
            lotSelectResultsElement.innerHTML = `<div class="message is-info">
              <p class="message-body">No results.</p>
              </div>`

            return
          }

          const panelElement = document.createElement('div')
          panelElement.className = 'panel'

          for (const lot of responseJSON.lots) {
            const panelBlockElement = document.createElement('a')
            panelBlockElement.className = 'panel-block is-block'
            panelBlockElement.href = '#'

            panelBlockElement.dataset.lotId = lot.lotId.toString()
            panelBlockElement.dataset.lotName = lot.lotName

            // eslint-disable-next-line no-unsanitized/property
            panelBlockElement.innerHTML = `<div class="columns">
              <div class="column">
                ${cityssm.escapeHTML(lot.lotName ?? '')}<br />
                <span class="is-size-7">${cityssm.escapeHTML(lot.mapName ?? '')}</span>
              </div>
              <div class="column">
                ${cityssm.escapeHTML(lot.lotStatus as string)}<br />
                <span class="is-size-7">
                  ${lot.lotOccupancyCount! > 0 ? 'Currently Occupied' : ''}
                </span>
              </div>
              </div>`

            panelBlockElement.addEventListener('click', selectExistingLot)

            panelElement.append(panelBlockElement)
          }

          lotSelectResultsElement.innerHTML = ''
          lotSelectResultsElement.append(panelElement)
        }
      )
    }

    function createLotAndSelect(submitEvent: SubmitEvent): void {
      submitEvent.preventDefault()

      const lotName = (
        lotSelectModalElement.querySelector(
          '#lotCreate--lotName'
        ) as HTMLInputElement
      ).value

      cityssm.postJSON(
        `${los.urlPrefix}/lots/doCreateLot`,
        submitEvent.currentTarget,
        (rawResponseJSON) => {
          const responseJSON = rawResponseJSON as {
            success: boolean
            errorMessage?: string
            lotId?: number
          }

          if (responseJSON.success) {
            renderSelectedLotAndClose(responseJSON.lotId ?? '', lotName)
          } else {
            bulmaJS.alert({
              title: `Error Creating ${los.escapedAliases.Lot}`,
              message: responseJSON.errorMessage ?? '',
              contextualColorName: 'danger'
            })
          }
        }
      )
    }

    cityssm.openHtmlModal('lotOccupancy-selectLot', {
      onshow(modalElement) {
        los.populateAliases(modalElement)
      },
      onshown(modalElement, closeModalFunction) {
        bulmaJS.toggleHtmlClipped()

        lotSelectModalElement = modalElement
        lotSelectCloseModalFunction = closeModalFunction

        bulmaJS.init(modalElement)

        // search Tab

        const lotNameFilterElement = modalElement.querySelector(
          '#lotSelect--lotName'
        ) as HTMLInputElement

        if (
          (document.querySelector('#lotOccupancy--lotId') as HTMLInputElement)
            .value !== ''
        ) {
          lotNameFilterElement.value = currentLotName
        }

        lotNameFilterElement.focus()
        lotNameFilterElement.addEventListener('change', searchLots)

        const occupancyStatusFilterElement = modalElement.querySelector(
          '#lotSelect--occupancyStatus'
        ) as HTMLSelectElement
        occupancyStatusFilterElement.addEventListener('change', searchLots)

        if (currentLotName !== '') {
          occupancyStatusFilterElement.value = ''
        }

        lotSelectFormElement = modalElement.querySelector(
          '#form--lotSelect'
        ) as HTMLFormElement
        lotSelectResultsElement = modalElement.querySelector(
          '#resultsContainer--lotSelect'
        ) as HTMLElement

        lotSelectFormElement.addEventListener('submit', (submitEvent) => {
          submitEvent.preventDefault()
        })

        searchLots()

        // Create Tab

        if (exports.lotNamePattern) {
          const regex = exports.lotNamePattern as RegExp

          ;(
            modalElement.querySelector(
              '#lotCreate--lotName'
            ) as HTMLInputElement
          ).pattern = regex.source
        }

        const lotTypeElement = modalElement.querySelector(
          '#lotCreate--lotTypeId'
        ) as HTMLSelectElement

        for (const lotType of exports.lotTypes as LotType[]) {
          const optionElement = document.createElement('option')
          optionElement.value = lotType.lotTypeId.toString()
          optionElement.textContent = lotType.lotType
          lotTypeElement.append(optionElement)
        }

        const lotStatusElement = modalElement.querySelector(
          '#lotCreate--lotStatusId'
        ) as HTMLSelectElement

        for (const lotStatus of exports.lotStatuses as LotStatus[]) {
          const optionElement = document.createElement('option')
          optionElement.value = lotStatus.lotStatusId.toString()
          optionElement.textContent = lotStatus.lotStatus
          lotStatusElement.append(optionElement)
        }

        const mapElement = modalElement.querySelector(
          '#lotCreate--mapId'
        ) as HTMLSelectElement

        for (const map of exports.maps as MapRecord[]) {
          const optionElement = document.createElement('option')
          optionElement.value = map.mapId!.toString()
          optionElement.textContent =
            (map.mapName ?? '') === '' ? '(No Name)' : map.mapName ?? ''
          mapElement.append(optionElement)
        }

        ;(
          modalElement.querySelector('#form--lotCreate') as HTMLFormElement
        ).addEventListener('submit', createLotAndSelect)
      },
      onremoved() {
        bulmaJS.toggleHtmlClipped()
      }
    })
  })

  document
    .querySelector('.is-lot-view-button')
    ?.addEventListener('click', () => {
      const lotId = (
        document.querySelector('#lotOccupancy--lotId') as HTMLInputElement
      ).value

      if (lotId === '') {
        bulmaJS.alert({
          message: `No ${los.escapedAliases.lot} selected.`,
          contextualColorName: 'info'
        })
      } else {
        window.open(`${los.urlPrefix}/lots/${lotId}`)
      }
    })

  document
    .querySelector('.is-clear-lot-button')
    ?.addEventListener('click', () => {
      if (lotNameElement.disabled) {
        bulmaJS.alert({
          message: 'You need to unlock the field before clearing it.',
          contextualColorName: 'info'
        })
      } else {
        lotNameElement.value = `(No ${los.escapedAliases.Lot})`
        ;(
          document.querySelector('#lotOccupancy--lotId') as HTMLInputElement
        ).value = ''

        setUnsavedChanges()
      }
    })

  // Start Date

  los.initializeDatePickers(formElement)

  document
    .querySelector('#lotOccupancy--occupancyStartDateString')
    ?.addEventListener('change', () => {
      const endDatePicker = (
        document.querySelector(
          '#lotOccupancy--occupancyEndDateString'
        ) as HTMLInputElement
      ).bulmaCalendar.datePicker

      endDatePicker.min = (
        document.querySelector(
          '#lotOccupancy--occupancyStartDateString'
        ) as HTMLInputElement
      ).value

      endDatePicker.refresh()
    })

  los.initializeUnlockFieldButtons(formElement)

  /*
   * Occupants
   */

  //=include lotOccupancyEditOccupants.js

  if (!isCreate) {
    //=include lotOccupancyEditComments.js
    //=include lotOccupancyEditFees.js
  }
})()
