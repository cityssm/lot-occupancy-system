import { testView } from "../../../test/_globals.js";
import { logout, login } from "../../support/index.js";
describe("Read Only User", () => {
    before(logout);
    after(logout);
    it("Logs In Successfully", () => {
        login(testView);
    });
    describe("Dashboard", () => {
        before(() => {
            cy.visit("/dashboard");
        });
        it("Has no detectable accessibility issues", () => {
            cy.injectAxe();
            cy.checkA11y();
        });
        it("Has no links to new areas", () => {
            cy.get("a[href*='/new']").should("not.exist");
        });
        it("Has no links to admin areas", () => {
            cy.get("a[href*='/admin']").should("not.exist");
        });
    });
    it("Has no link to create maps on Map Search", () => {
        cy.visit("/maps");
        cy.get("a[href*='/new']").should("not.exist");
    });
    it("Has no link to create lots on Lot Search", () => {
        cy.visit("/lots");
        cy.get("a[href*='/new']").should("not.exist");
    });
    it("Has no link to create occupancies on Occupancy Search", () => {
        cy.visit("/lotOccupancies");
        cy.get("a[href*='/new']").should("not.exist");
    });
    it("Has no link to create work orders on Work Order Search", () => {
        cy.visit("/workOrders");
        cy.get("a[href*='/new']").should("not.exist");
    });
    it("Redirects to Dashboard when attempting to create a work order", () => {
        cy.visit("/workOrders/new");
        cy.wait(200);
        cy.location("pathname").should("equal", "/dashboard");
    });
    it("Redirects to Dashboard when attempting to alter fees", () => {
        cy.visit("/admin/fees");
        cy.wait(200);
        cy.location("pathname").should("not.contain", "/admin");
    });
});
