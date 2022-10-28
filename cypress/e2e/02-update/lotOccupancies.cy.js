import { testUpdate } from "../../../test/_globals.js";
import { logout, login } from "../../support/index.js";
describe("Update - Lot Occupancies", () => {
    before(() => {
        logout();
        login(testUpdate);
    });
    it('Has a "Create" link on the Lot Occupancy Search', () => {
        cy.visit("/lotOccupancies");
        cy.get("a[href$='/lotOccupancies/new']").should("exist");
    });
    describe("Update a New Lot Occupancy", () => {
        before(() => {
            cy.visit("/lotOccupancies/new");
        });
        it("Has no detectable accessibility issues", () => {
            cy.injectAxe();
            cy.checkA11y();
        });
    });
});
