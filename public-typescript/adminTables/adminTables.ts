// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */

import type { LOS } from '../../types/globalTypes.js'

declare const exports: Record<string, unknown>
;(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const los = exports.los as LOS

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function refreshFontAwesomeIcon(changeEvent: Event): void {
    const inputElement = changeEvent.currentTarget as HTMLInputElement

    const fontAwesomeIconClass = inputElement.value

    // eslint-disable-next-line no-unsanitized/property
    ;(
      inputElement.closest('.field')?.querySelectorAll(
        '.button.is-static'
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ) as NodeListOf<HTMLButtonElement>
    )[1].innerHTML =
      `<i class="fas fa-fw fa-${fontAwesomeIconClass}" aria-hidden="true"></i>`
  }

  //=include adminTablesWorkOrderTypes.js

  // eslint-disable-next-line no-secrets/no-secrets
  //=include adminTablesWorkOrderMilestoneTypes.js

  //=include adminTablesLotStatuses.js

  // eslint-disable-next-line no-secrets/no-secrets
  //=include adminTablesLotOccupantTypes.js
})()
