describe('Customer page', () => {
  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.visit('/home')
  })

  it('Show search bar', () => {
    cy.get('input').should('be.visible')
  })

  it('See posters', () => {
    cy.get('.poster-grid').should('be.visible')
  })

})