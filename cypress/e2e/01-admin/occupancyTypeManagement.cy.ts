/* eslint-disable unicorn/filename-case, promise/catch-or-return, promise/always-return */

import { testAdmin } from "../../../test/_globals.js";

import { logout, login } from "../../support/index.js";

describe("Admin - Occupancy Type Management", () => {
    before(() => {
        logout();
        login(testAdmin);
    });

    after(logout);

    beforeEach("Loads page", () => {
        cy.visit("/admin/occupancyTypes");
        cy.location("pathname").should("equal", "/admin/occupancyTypes");
    });

    it("Has no detectable accessibility issues", () => {
        cy.injectAxe();
        cy.checkA11y();
    });
});
