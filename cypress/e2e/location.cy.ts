describe('Customer page', () => {
  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.visit('/')
  })

  it('Show location page', () => {
    cy.contains('Choose your location').should('be.visible')
  })
})