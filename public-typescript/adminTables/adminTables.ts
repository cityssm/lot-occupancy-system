/* eslint-disable spaced-comment, @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */

import type * as globalTypes from '../../types/globalTypes'
;(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const los = exports.los as globalTypes.LOS

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function refreshFontAwesomeIcon(changeEvent: Event): void {
    const inputElement = changeEvent.currentTarget as HTMLInputElement

    const fontAwesomeIconClass = inputElement.value

    inputElement
      .closest('.field')!
      .querySelectorAll(
        '.button.is-static'
      )[1].innerHTML = `<i class="fas fa-fw fa-${fontAwesomeIconClass}" aria-hidden="true"></i>`
  }

  //=include adminTablesWorkOrderTypes.js
  //=include adminTablesWorkOrderMilestoneTypes.js
  //=include adminTablesLotStatuses.js
  //=include adminTablesLotOccupantTypes.js
})()
