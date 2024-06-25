// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */

import type * as globalTypes from '../types/globalTypes.js'

declare const exports: Record<string, unknown>
;(() => {
  const mapContainerElement: HTMLElement | null =
    document.querySelector('#lot--map')

  if (mapContainerElement !== null) {
    ;(exports.los as globalTypes.LOS).highlightMap(
      mapContainerElement,
      mapContainerElement.dataset.mapKey ?? '',
      'success'
    )
  }
})()
