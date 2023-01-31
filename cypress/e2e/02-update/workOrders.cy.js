import { testUpdate } from '../../../test/_globals.js';
import { logout, login } from '../../support/index.js';
describe('Update - Work Orders', () => {
    beforeEach(() => {
        logout();
        login(testUpdate);
    });
    afterEach(logout);
    it('Has a "Create" link on the Work Order Search', () => {
        cy.visit('/workOrders');
        cy.location('pathname').should('equal', '/workOrders');
        cy.get("a[href$='/workOrders/new']").should('exist');
    });
    describe('Update a New Work Order', () => {
        it('Has no detectable accessibility issues', () => {
            cy.visit('/workOrders/new');
            cy.location('pathname').should('equal', '/workOrders/new');
            cy.injectAxe();
            cy.checkA11y();
        });
    });
});
