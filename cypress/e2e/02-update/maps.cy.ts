import { testUpdate } from "../../../test/_globals.js";

import { logout, login } from "../../support/index.js";

import * as configFunctions from "../../../helpers/functions.config.js";

import type * as recordTypes from "../../../types/recordTypes";

describe("Update - Maps", () => {
    before(() => {
        logout();
        login(testUpdate);
    });

    it('Has a "Create" link on the Map Search', () => {
        cy.visit("/maps");
        cy.get("a[href$='/maps/new']").should("exist");
    });

    describe("Update a New Map", () => {
        before(() => {
            cy.visit("/maps/new");
        });

        it("Has no detectable accessibility issues", () => {
            cy.injectAxe();
            cy.checkA11y();
        });

        it("Can populate basic details", () => {
            // eslint-disable-next-line promise/catch-or-return, promise/always-return
            cy.fixture("map.json").then((mapJSON: recordTypes.Map) => {
                cy.get("input[name='mapName']").clear().type(mapJSON.mapName);
                cy.get("textarea[name='mapDescription']").clear().type(mapJSON.mapDescription);

                cy.get("input[name='mapAddress1']").clear().type(mapJSON.mapAddress1);
                cy.get("input[name='mapAddress2']").clear().type(mapJSON.mapAddress2);
                cy.get("input[name='mapPostalCode']").clear().type(mapJSON.mapPostalCode);
                cy.get("input[name='mapPhoneNumber']").clear().type(mapJSON.mapPhoneNumber);

                cy.get("input[name='mapLatitude']").clear().type(mapJSON.mapLatitude.toString());
                cy.get("input[name='mapLongitude']").clear().type(mapJSON.mapLongitude.toString());
            });
        });

        it("Should use the default map city and province", () => {
            cy.get("input[name='mapCity']").should(
                "have.value",
                configFunctions.getProperty("settings.map.mapCityDefault")
            );

            cy.get("input[name='mapProvince']").should(
                "have.value",
                configFunctions.getProperty("settings.map.mapProvinceDefault")
            );
        });

        it("Should submit form and create the map", () => {
            cy.get("#form--map").submit();

            cy.wait(1000);

            cy.location("pathname").should("not.contain", "/new").should("contain", "/edit");
        });

        it("Should be populated as expected", () => {
            // eslint-disable-next-line promise/catch-or-return, promise/always-return
            cy.fixture("map.json").then((mapJSON: recordTypes.Map) => {
                cy.get("input[name='mapName']").should("have.value",mapJSON.mapName);
                cy.get("textarea[name='mapDescription']").should("have.value",mapJSON.mapDescription);

                cy.get("input[name='mapAddress1']").should("have.value",mapJSON.mapAddress1);
                cy.get("input[name='mapAddress2']").should("have.value",mapJSON.mapAddress2);

                cy.get("input[name='mapCity']").should("have.value",  configFunctions.getProperty("settings.map.mapCityDefault"));
                cy.get("input[name='mapProvince']").should("have.value",  configFunctions.getProperty("settings.map.mapProvinceDefault"));

                cy.get("input[name='mapPostalCode']").should("have.value",mapJSON.mapPostalCode);
                cy.get("input[name='mapPhoneNumber']").should("have.value",mapJSON.mapPhoneNumber);

                cy.get("input[name='mapLatitude']").should("have.value",mapJSON.mapLatitude.toString());
                cy.get("input[name='mapLongitude']").should("have.value",mapJSON.mapLongitude.toString());
            });
        });
    });
});
