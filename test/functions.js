import * as assert from "assert";
import fs from "node:fs";
import * as userFunctions from "../helpers/functions.user.js";
describe("functions.user", () => {
    describe("unauthenticated, no user in session", () => {
        const noUserRequest = {
            session: {}
        };
        it("can not update", () => {
            assert.strictEqual(userFunctions.userCanUpdate(noUserRequest), false);
        });
        it("is not admin", () => {
            assert.strictEqual(userFunctions.userIsAdmin(noUserRequest), false);
        });
    });
    describe("read only user, no update, no admin", () => {
        const readOnlyRequest = {
            session: {
                user: {
                    userName: "*test",
                    userProperties: {
                        canUpdate: false,
                        isAdmin: false,
                        apiKey: ""
                    }
                }
            }
        };
        it("can not update", () => {
            assert.strictEqual(userFunctions.userCanUpdate(readOnlyRequest), false);
        });
        it("is not admin", () => {
            assert.strictEqual(userFunctions.userIsAdmin(readOnlyRequest), false);
        });
    });
    describe("update only user, no admin", () => {
        const updateOnlyRequest = {
            session: {
                user: {
                    userName: "*test",
                    userProperties: {
                        canUpdate: true,
                        isAdmin: false,
                        apiKey: ""
                    }
                }
            }
        };
        it("can update", () => {
            assert.strictEqual(userFunctions.userCanUpdate(updateOnlyRequest), true);
        });
        it("is not admin", () => {
            assert.strictEqual(userFunctions.userIsAdmin(updateOnlyRequest), false);
        });
    });
    describe("admin only user, no update", () => {
        const adminOnlyRequest = {
            session: {
                user: {
                    userName: "*test",
                    userProperties: {
                        canUpdate: false,
                        isAdmin: true,
                        apiKey: ""
                    }
                }
            }
        };
        it("can not update", () => {
            assert.strictEqual(userFunctions.userCanUpdate(adminOnlyRequest), false);
        });
        it("is admin", () => {
            assert.strictEqual(userFunctions.userIsAdmin(adminOnlyRequest), true);
        });
    });
    describe("update admin user", () => {
        const updateAdminRequest = {
            session: {
                user: {
                    userName: "*test",
                    userProperties: {
                        canUpdate: true,
                        isAdmin: true,
                        apiKey: ""
                    }
                }
            }
        };
        it("can update", () => {
            assert.strictEqual(userFunctions.userCanUpdate(updateAdminRequest), true);
        });
        it("is admin", () => {
            assert.strictEqual(userFunctions.userIsAdmin(updateAdminRequest), true);
        });
    });
    describe("API key check", () => {
        it("authenticates with a valid API key", async () => {
            const apiKeysJSON = JSON.parse(fs.readFileSync("data/apiKeys.json", "utf8"));
            const apiKey = Object.values(apiKeysJSON)[0];
            const apiRequest = {
                params: {
                    apiKey
                }
            };
            assert.strictEqual(await userFunctions.apiKeyIsValid(apiRequest), true);
        });
        it("fails to authenticate with an invalid API key", async () => {
            const apiRequest = {
                params: {
                    apiKey: "badKey"
                }
            };
            assert.strictEqual(await userFunctions.apiKeyIsValid(apiRequest), false);
        });
        it("fails to authenticate with no API key", async () => {
            const apiRequest = {
                params: {}
            };
            assert.strictEqual(await userFunctions.apiKeyIsValid(apiRequest), false);
        });
    });
});
