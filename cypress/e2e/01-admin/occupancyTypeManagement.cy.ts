/* eslint-disable unicorn/filename-case, promise/catch-or-return, promise/always-return */

import { testAdmin } from "../../../test/_globals.js";

import { logout, login } from "../../support/index.js";

describe("Admin - Occupancy Type Management", () => {
    
    beforeEach("Loads page", () => {
        logout();
        login(testAdmin);
        cy.visit("/admin/occupancyTypes");
        cy.location("pathname").should("equal", "/admin/occupancyTypes");
    });
    
    afterEach(logout);

    it("Has no detectable accessibility issues", () => {
        cy.injectAxe();
        cy.checkA11y();
    });
});
