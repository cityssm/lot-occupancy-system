/* eslint-disable unicorn/filename-case */

import * as assert from 'node:assert'
import { initializeCemeteryDatabase } from '../helpers/initializer.database.cemetery.js'

describe('Initialize Database', () => {
  it('initializes a cemetery database', async () => {
    const success = await initializeCemeteryDatabase()

    assert.ok(success)
  })
})
