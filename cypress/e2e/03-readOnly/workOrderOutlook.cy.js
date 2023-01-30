import { testView } from '../../../test/_globals.js';
import { logout, login } from '../../support/index.js';
describe('Work Order Outlook Integration', () => {
    beforeEach(() => {
        logout();
        login(testView);
    });
    afterEach(logout);
    it('Has no detectable accessibility issues', () => {
        cy.visit('/workOrders/outlook');
        cy.location('pathname').should('equal', '/workOrders/outlook');
        cy.injectAxe();
        cy.checkA11y();
    });
});
