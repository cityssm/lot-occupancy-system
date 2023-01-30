import { testView } from '../../../test/_globals.js'

import { logout, login } from '../../support/index.js'

describe('Work Order Milestone Calendar', () => {
  beforeEach(() => {
    logout()
    login(testView)
  })

  afterEach(logout)

  it('Has no detectable accessibility issues', () => {
    cy.visit('/workOrders/milestoneCalendar')
    cy.location('pathname').should('equal', '/workOrders/milestoneCalendar')
    cy.injectAxe()
    cy.checkA11y()
  })
})
