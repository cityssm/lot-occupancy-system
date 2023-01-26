import * as assert from 'node:assert';
import fs from 'node:fs';
import * as userFunctions from '../helpers/functions.user.js';
import * as sqlFilterFunctions from '../helpers/functions.sqlFilters.js';
import * as iconFunctions from '../helpers/functions.icons.js';
describe('functions.user', () => {
    describe('unauthenticated, no user in session', () => {
        const noUserRequest = {
            session: {}
        };
        it('can not update', () => {
            assert.strictEqual(userFunctions.userCanUpdate(noUserRequest), false);
        });
        it('is not admin', () => {
            assert.strictEqual(userFunctions.userIsAdmin(noUserRequest), false);
        });
    });
    describe('read only user, no update, no admin', () => {
        const readOnlyRequest = {
            session: {
                user: {
                    userName: '*test',
                    userProperties: {
                        canUpdate: false,
                        isAdmin: false,
                        apiKey: ''
                    }
                }
            }
        };
        it('can not update', () => {
            assert.strictEqual(userFunctions.userCanUpdate(readOnlyRequest), false);
        });
        it('is not admin', () => {
            assert.strictEqual(userFunctions.userIsAdmin(readOnlyRequest), false);
        });
    });
    describe('update only user, no admin', () => {
        const updateOnlyRequest = {
            session: {
                user: {
                    userName: '*test',
                    userProperties: {
                        canUpdate: true,
                        isAdmin: false,
                        apiKey: ''
                    }
                }
            }
        };
        it('can update', () => {
            assert.strictEqual(userFunctions.userCanUpdate(updateOnlyRequest), true);
        });
        it('is not admin', () => {
            assert.strictEqual(userFunctions.userIsAdmin(updateOnlyRequest), false);
        });
    });
    describe('admin only user, no update', () => {
        const adminOnlyRequest = {
            session: {
                user: {
                    userName: '*test',
                    userProperties: {
                        canUpdate: false,
                        isAdmin: true,
                        apiKey: ''
                    }
                }
            }
        };
        it('can not update', () => {
            assert.strictEqual(userFunctions.userCanUpdate(adminOnlyRequest), false);
        });
        it('is admin', () => {
            assert.strictEqual(userFunctions.userIsAdmin(adminOnlyRequest), true);
        });
    });
    describe('update admin user', () => {
        const updateAdminRequest = {
            session: {
                user: {
                    userName: '*test',
                    userProperties: {
                        canUpdate: true,
                        isAdmin: true,
                        apiKey: ''
                    }
                }
            }
        };
        it('can update', () => {
            assert.strictEqual(userFunctions.userCanUpdate(updateAdminRequest), true);
        });
        it('is admin', () => {
            assert.strictEqual(userFunctions.userIsAdmin(updateAdminRequest), true);
        });
    });
    describe('API key check', () => {
        it('authenticates with a valid API key', async () => {
            const apiKeysJSON = JSON.parse(fs.readFileSync('data/apiKeys.json', 'utf8'));
            const apiKey = Object.values(apiKeysJSON)[0];
            const apiRequest = {
                params: {
                    apiKey
                }
            };
            assert.strictEqual(await userFunctions.apiKeyIsValid(apiRequest), true);
        });
        it('fails to authenticate with an invalid API key', async () => {
            const apiRequest = {
                params: {
                    apiKey: 'badKey'
                }
            };
            assert.strictEqual(await userFunctions.apiKeyIsValid(apiRequest), false);
        });
        it('fails to authenticate with no API key', async () => {
            const apiRequest = {
                params: {}
            };
            assert.strictEqual(await userFunctions.apiKeyIsValid(apiRequest), false);
        });
    });
});
describe('functions.sqlFilters', () => {
    describe('LotName filter', () => {
        it('returns startsWith filter', () => {
            const filter = sqlFilterFunctions.getLotNameWhereClause('TEST1 TEST2', 'startsWith', 'l');
            assert.strictEqual(filter.sqlWhereClause, " and l.lotName like ? || '%'");
            assert.strictEqual(filter.sqlParameters.length, 1);
            assert.ok(filter.sqlParameters.includes('TEST1 TEST2'));
        });
        it('returns endsWith filter', () => {
            const filter = sqlFilterFunctions.getLotNameWhereClause('TEST1 TEST2', 'endsWith', 'l');
            assert.strictEqual(filter.sqlWhereClause, " and l.lotName like '%' || ?");
            assert.strictEqual(filter.sqlParameters.length, 1);
            assert.strictEqual(filter.sqlParameters[0], 'TEST1 TEST2');
        });
        it('returns contains filter', () => {
            const filter = sqlFilterFunctions.getLotNameWhereClause('TEST1 TEST2', '', 'l');
            assert.strictEqual(filter.sqlWhereClause, ' and instr(lower(l.lotName), ?) and instr(lower(l.lotName), ?)');
            assert.ok(filter.sqlParameters.includes('test1'));
            assert.ok(filter.sqlParameters.includes('test2'));
        });
        it('handles empty filter', () => {
            const filter = sqlFilterFunctions.getLotNameWhereClause('', '');
            assert.strictEqual(filter.sqlWhereClause, '');
            assert.strictEqual(filter.sqlParameters.length, 0);
        });
        it('handles undefined filter', () => {
            const filter = sqlFilterFunctions.getLotNameWhereClause(undefined, undefined, 'l');
            assert.strictEqual(filter.sqlWhereClause, '');
            assert.strictEqual(filter.sqlParameters.length, 0);
        });
    });
    describe('OccupancyTime filter', () => {
        it('creates three different filters', () => {
            const currentFilter = sqlFilterFunctions.getOccupancyTimeWhereClause('current');
            assert.notStrictEqual(currentFilter.sqlWhereClause, '');
            const pastFilter = sqlFilterFunctions.getOccupancyTimeWhereClause('past');
            assert.notStrictEqual(pastFilter.sqlWhereClause, '');
            const futureFilter = sqlFilterFunctions.getOccupancyTimeWhereClause('future');
            assert.notStrictEqual(futureFilter, '');
            assert.notStrictEqual(currentFilter.sqlWhereClause, pastFilter.sqlWhereClause);
            assert.notStrictEqual(currentFilter.sqlWhereClause, futureFilter.sqlWhereClause);
            assert.notStrictEqual(pastFilter.sqlWhereClause, futureFilter.sqlWhereClause);
        });
        it('handles empty filter', () => {
            const filter = sqlFilterFunctions.getOccupancyTimeWhereClause('');
            assert.strictEqual(filter.sqlWhereClause, '');
            assert.strictEqual(filter.sqlParameters.length, 0);
        });
        it('handles undefined filter', () => {
            const filter = sqlFilterFunctions.getOccupancyTimeWhereClause(undefined, 'o');
            assert.strictEqual(filter.sqlWhereClause, '');
            assert.strictEqual(filter.sqlParameters.length, 0);
        });
    });
    describe('OccupantName filter', () => {
        it('returns filter', () => {
            const filter = sqlFilterFunctions.getOccupantNameWhereClause('TEST1 TEST2', 'o');
            assert.strictEqual(filter.sqlWhereClause, ' and instr(lower(o.occupantName), ?) and instr(lower(o.occupantName), ?)');
            assert.ok(filter.sqlParameters.includes('test1'));
            assert.ok(filter.sqlParameters.includes('test2'));
        });
        it('handles empty filter', () => {
            const filter = sqlFilterFunctions.getOccupantNameWhereClause('');
            assert.strictEqual(filter.sqlWhereClause, '');
            assert.strictEqual(filter.sqlParameters.length, 0);
        });
        it('handles undefined filter', () => {
            const filter = sqlFilterFunctions.getOccupantNameWhereClause(undefined, 'o');
            assert.strictEqual(filter.sqlWhereClause, '');
            assert.strictEqual(filter.sqlParameters.length, 0);
        });
    });
});
describe('functions.icons', () => {
    it('returns a list of icon classes', async () => {
        const iconClasses = await iconFunctions.getSolidIconClasses();
        assert.ok(iconClasses.includes('save'));
    });
});
