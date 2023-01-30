import { testView } from '../../../test/_globals.js'

import { logout, login, ajaxDelayMillis } from '../../support/index.js'

describe('Work Order Milestone Calendar', () => {
  beforeEach(() => {
    logout()
    login(testView)
  })

  afterEach(logout)

  it('Has no detectable accessibility issues', () => {
    cy.visit('/workOrders/milestoneCalendar')
    cy.location('pathname').should('equal', '/workOrders/milestoneCalendar')
    cy.wait(ajaxDelayMillis)
    cy.injectAxe()
    cy.checkA11y()
  })
})
