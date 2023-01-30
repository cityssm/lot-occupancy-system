/* eslint-disable unicorn/filename-case */

import * as assert from 'node:assert'

import fs from 'node:fs/promises'

import { initializeCemeteryDatabase } from '../helpers/initializer.database.cemetery.js'
import { lotOccupancyDB as databasePath } from '../data/databasePaths.js'

describe('Initialize Database', () => {
  it('initializes a cemetery database', async () => {
    await fs.unlink(databasePath)

    const success = await initializeCemeteryDatabase()

    assert.ok(success)
  })
})
