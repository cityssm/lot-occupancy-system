/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */

describe('Keep Alive', () => {
  it('Returns true', () => {
    cy.request('/keepAlive').then((response) => {
      expect(response.body).eq(true)
    })
  })
})
