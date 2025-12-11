describe('Price Setting', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/owner/prices').as('getPrices')
    cy.visit('/PriceSetting')
    cy.wait('@getPrices', { timeout: 10000 })
    cy.wait(1000)
  })

  it('should load price setting page', () => {
    cy.url().should('include', '/PriceSetting')
    cy.contains('Ticket Price Settings').should('be.visible')
  })

  it('should display price inputs', () => {
    cy.get('input[name="adult_price"]').should('exist')
    cy.get('input[name="child_price"]').should('exist')
  })

})