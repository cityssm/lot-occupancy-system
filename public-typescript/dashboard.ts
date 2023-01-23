/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from '../types/globalTypes'
;(() => {
  const los = exports.los as globalTypes.LOS

  const workOrderNumberCircleElements: NodeListOf<HTMLElement> =
    document.querySelectorAll('.fa-circle[data-work-order-number')

  for (const workOrderNumberCircleElement of workOrderNumberCircleElements) {
    workOrderNumberCircleElement.style.color = los.getRandomColor(
      workOrderNumberCircleElement.dataset.workOrderNumber ?? ''
    )
  }
})()
