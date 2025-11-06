describe('Customer page', () => {
  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.visit('/')
  })

  it('Show location page', () => {
    cy.contains('Choose your location').should('be.visible')
  })

  it('navigates to homepage after choosing a location', () => {
    cy.get('[data-test=location-oulu]').click()
    cy.url().should('include', '/home')
  })

})