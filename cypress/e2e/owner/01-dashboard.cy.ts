describe('Owner Dashboard', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/owner/dashboard-stats').as('getDashboard')
    cy.visit('/OwnerDashboard')
    cy.wait('@getDashboard', { timeout: 10000 })
    cy.wait(1000)
  })

  it('should load dashboard page successfully', () => {
    cy.url().should('include', '/OwnerDashboard')
    cy.get('.owner-dashboard').should('exist')
  })

  it('should display all statistics cards', () => {
    cy.contains('TOTAL TICKETS SOLD').should('be.visible')
    cy.contains('TOTAL REVENUE').should('be.visible')
    cy.contains('TOTAL THEATERS').should('be.visible')
    cy.contains('TOTAL MOVIES').should('be.visible')
  })

  it('should display revenue chart', () => {
    cy.contains('REVENUE OVERVIEW').should('be.visible')
    cy.get('canvas').should('exist')
  })
})
