import { testUpdate } from "../../../test/_globals.js";

import { logout, login } from "../../support/index.js";

describe("Update - Lots", () => {
    before(() => {
        logout();
        login(testUpdate);
    });

    it('Has a "Create" link on the Lot Search', () => {
        cy.visit("/lots");
        cy.get("a[href$='/lots/new']").should("exist");
    });

    describe("Update a New Lot", () => {
        before(() => {
            cy.visit("/lots/new");
        });

        it("Has no detectable accessibility issues", () => {
            cy.injectAxe();
            cy.checkA11y();
        });
    });
});
