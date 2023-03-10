/* eslint-disable @typescript-eslint/no-non-null-assertion, unicorn/prefer-module */

import type * as globalTypes from '../types/globalTypes'
;(() => {
  const mapContainerElement: HTMLElement | null =
    document.querySelector('#lot--map')

  if (mapContainerElement) {
    ;(exports.los as globalTypes.LOS).highlightMap(
      mapContainerElement,
      mapContainerElement.dataset.mapKey!,
      'success'
    )
  }
})()
