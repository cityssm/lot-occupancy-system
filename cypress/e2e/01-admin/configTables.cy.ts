/* eslint-disable unicorn/filename-case, promise/catch-or-return, promise/always-return */

import { testAdmin } from "../../../test/_globals.js";

import { logout, login } from "../../support/index.js";

describe("Admin - Config Table Management", () => {
    before(() => {
        logout();
        login(testAdmin);
    });

    after(logout);

    beforeEach("Loads page", () => {
        cy.visit("/admin/tables");
        cy.location("pathname").should("equal", "/admin/tables");
    });

    it("Has no detectable accessibility issues", () => {
        cy.get(".tabs a").each(($tab) => {
            cy.wrap($tab).click({ force: true });
            cy.injectAxe();
            cy.checkA11y();
        });
    });
});
