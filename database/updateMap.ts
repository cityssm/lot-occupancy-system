import { acquireConnection } from './pool.js'

interface UpdateMapForm {
  mapId: string
  mapName: string
  mapDescription: string
  mapSVG: string
  mapLatitude: string
  mapLongitude: string
  mapAddress1: string
  mapAddress2: string
  mapCity: string
  mapProvince: string
  mapPostalCode: string
  mapPhoneNumber: string
}

export async function updateMap(
  mapForm: UpdateMapForm,
  user: User
): Promise<boolean> {
  const database = await acquireConnection()

  const result = database
    .prepare(
      `update Maps
        set mapName = ?,
        mapDescription = ?,
        mapSVG = ?,
        mapLatitude = ?,
        mapLongitude = ?,
        mapAddress1 = ?,
        mapAddress2 = ?,
        mapCity = ?,
        mapProvince = ?,
        mapPostalCode = ?,
        mapPhoneNumber = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where mapId = ?
        and recordDelete_timeMillis is null`
    )
    .run(
      mapForm.mapName,
      mapForm.mapDescription,
      mapForm.mapSVG,
      mapForm.mapLatitude === '' ? undefined : mapForm.mapLatitude,
      mapForm.mapLongitude === '' ? undefined : mapForm.mapLongitude,
      mapForm.mapAddress1,
      mapForm.mapAddress2,
      mapForm.mapCity,
      mapForm.mapProvince,
      mapForm.mapPostalCode,
      mapForm.mapPhoneNumber,
      user.userName,
      Date.now(),
      mapForm.mapId
    )

  database.release()

  return result.changes > 0
}

export default updateMap
