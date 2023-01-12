import { testUpdate } from '../../../test/_globals.js'

import { logout, login } from '../../support/index.js'

describe('Update - Lots', () => {
  beforeEach('Loads page', () => {
    logout()
    login(testUpdate)
  })

  afterEach(logout)

  it('Has a "Create" link on the Lot Search', () => {
    cy.visit('/lots')
    cy.location('pathname').should('equal', '/lots')
    cy.get("a[href$='/lots/new']").should('exist')
  })

  describe('Update a New Lot', () => {
    it('Has no detectable accessibility issues', () => {
      cy.visit('/lots/new')
      cy.injectAxe()
      cy.checkA11y()
    })
  })
})
