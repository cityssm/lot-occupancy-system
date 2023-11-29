import { testAdmin } from '../../../test/_globals.js'
import { logout, login } from '../../support/index.js'

describe('Admin - Config Table Management', () => {
  beforeEach('Loads page', () => {
    logout()
    login(testAdmin)
    cy.visit('/admin/tables')
    cy.location('pathname').should('equal', '/admin/tables')
  })

  afterEach(logout)

  it('Has no detectable accessibility issues', () => {
    cy.get('.tabs a').each(($tab) => {
      cy.wrap($tab).click({ force: true })
      cy.injectAxe()
      cy.checkA11y()
    })
  })
})
