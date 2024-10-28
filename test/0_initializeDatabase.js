/* eslint-disable unicorn/filename-case, @eslint-community/eslint-comments/disable-enable-pair */
import assert from 'node:assert';
import fs from 'node:fs/promises';
import { lotOccupancyDB as databasePath, useTestDatabases } from '../data/databasePaths.js';
import { initializeCemeteryDatabase } from '../helpers/initializer.database.cemetery.js';
describe('Initialize Database', () => {
    it('initializes a cemetery database', async () => {
        if (!useTestDatabases) {
            assert.fail('Test database must be used!');
        }
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        await fs.unlink(databasePath);
        const success = await initializeCemeteryDatabase();
        assert.ok(success);
    });
});
