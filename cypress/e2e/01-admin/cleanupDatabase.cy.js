import { testAdmin } from "../../../test/_globals.js";
import { logout, login, ajaxDelayMillis } from "../../support/index.js";
describe("Admin - Cleanup Database", () => {
    before(() => {
        logout();
        login(testAdmin);
    });
    after(logout);
    beforeEach("Loads page", () => {
        cy.visit("/admin/cleanup");
        cy.location("pathname").should("equal", "/admin/cleanup");
    });
    it("Has no detectable accessibility issues", () => {
        cy.injectAxe();
        cy.checkA11y();
    });
    it("Cleans up the database", () => {
        cy.get("button[data-cy='cleanup']").click();
        cy.get(".modal").should("be.visible").should("contain.text", "Cleanup");
        cy.get(".modal button[data-cy='ok']").click();
        cy.wait(ajaxDelayMillis);
        cy.get(".modal").should("contain.text", "Cleaned Up").should("contain.text", "Success");
        cy.get(".modal button[data-cy='ok']").click();
    });
});
