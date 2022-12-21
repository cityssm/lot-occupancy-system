import { testAdmin } from "../../../test/_globals.js";
import { logout, login } from "../../support/index.js";
describe("Admin - Lot Type Management", () => {
    beforeEach("Loads page", () => {
        logout();
        login(testAdmin);
        cy.visit("/admin/lotTypes");
        cy.location("pathname").should("equal", "/admin/lotTypes");
    });
    afterEach(logout);
    it("Has no detectable accessibility issues", () => {
        cy.injectAxe();
        cy.checkA11y();
    });
});
