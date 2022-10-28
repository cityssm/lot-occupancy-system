import { testAdmin } from "../../../test/_globals.js";
import { logout, login, ajaxDelayMillis } from "../../support/index.js";
import * as configFunctions from "../../../helpers/functions.config.js";
describe("Admin - Fee Management", () => {
    before(() => {
        logout();
        login(testAdmin);
    });
    after(logout);
    beforeEach("Loads page", () => {
        cy.visit("/admin/fees");
        cy.location("pathname").should("equal", "/admin/fees");
    });
    it("Has no detectable accessibility issues", () => {
        cy.injectAxe();
        cy.checkA11y();
    });
    it("Creates a new fee category", () => {
        cy.get("[data-cy='addFeeCategory']").click();
        cy.get(".modal").should("be.visible");
        cy.injectAxe();
        cy.checkA11y();
        cy.fixture("fee.json").then((fee) => {
            cy.get(".modal input[name='feeCategory']").type(fee.feeCategory);
            cy.get(".modal button[type='submit']").click();
            cy.wait(ajaxDelayMillis);
            cy.get(".container--feeCategory .panel-heading .title").should("contain.text", fee.feeCategory);
        });
    });
    it.only("Creates a new fee", () => {
        cy.get("[data-cy='addFee']").first().click();
        cy.get(".modal").should("be.visible");
        cy.injectAxe();
        cy.checkA11y();
        cy.fixture("fee.json").then((fee) => {
            cy.get(".modal input[name='feeName']").type(fee.feeName);
            cy.get(".modal textarea[name='feeDescription']").type(fee.feeDescription);
            cy.get(".modal input[name='feeAmount']").clear().type(fee.feeAmount.toString());
            cy.get(".modal input[name='taxAmount']").should("be.disabled");
            cy.get(".modal input[name='taxPercentage']")
                .invoke("val")
                .should("equal", configFunctions.getProperty("settings.fees.taxPercentageDefault").toString());
            cy.get(".modal input[name='quantityUnit']").should("be.disabled");
            cy.get(".modal select[name='includeQuantity']").select("1");
            cy.get(".modal input[name='quantityUnit']")
                .should("not.be.disabled")
                .type(fee.quantityUnit);
            cy.get(".modal button[type='submit']").click();
            cy.wait(ajaxDelayMillis);
            cy.get(".container--fee a").should("contain.text", fee.feeName);
        });
    });
});