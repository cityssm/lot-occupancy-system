import type { Request, Response } from 'express'

import * as configFunctions from '../../helpers/functions.config.js'
import { getMapSVGs } from '../../helpers/functions.map.js'
import type { MapRecord } from '../../types/recordTypes.js'

export async function handler(
  _request: Request,
  response: Response
): Promise<void> {
  const map: MapRecord = {
    mapCity: configFunctions.getProperty('settings.map.mapCityDefault'),
    mapProvince: configFunctions.getProperty('settings.map.mapProvinceDefault')
  }

  const mapSVGs = await getMapSVGs()

  response.render('map-edit', {
    headTitle: `${configFunctions.getProperty('aliases.map')} Create`,
    isCreate: true,
    map,
    mapSVGs
  })
}

export default handler
