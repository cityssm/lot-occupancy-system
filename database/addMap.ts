import { acquireConnection } from './pool.js'

export interface AddMapForm {
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

export default async function addMap(
  mapForm: AddMapForm,
  user: User
): Promise<number> {
  const database = await acquireConnection()

  const rightNowMillis = Date.now()

  const result = database
    .prepare(
      `insert into Maps (
        mapName, mapDescription,
        mapSVG, mapLatitude, mapLongitude,
        mapAddress1, mapAddress2,
        mapCity, mapProvince, mapPostalCode,
        mapPhoneNumber,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
      rightNowMillis,
      user.userName,
      rightNowMillis
    )

  database.release()

  return result.lastInsertRowid as number
}
