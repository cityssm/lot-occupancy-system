/* eslint-disable unicorn/filename-case */

import * as assert from 'node:assert'

import fs from 'node:fs/promises'

import { initializeCemeteryDatabase } from '../helpers/initializer.database.cemetery.js'
import {
  lotOccupancyDB as databasePath,
  useTestDatabases
} from '../data/databasePaths.js'

describe('Initialize Database', () => {
  it('initializes a cemetery database', async () => {
    if (!useTestDatabases) {
      assert.fail('Test database must be used!')
    }

    await fs.unlink(databasePath)

    const success = await initializeCemeteryDatabase()

    assert.ok(success)
  })
})
