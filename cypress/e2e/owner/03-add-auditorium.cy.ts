describe('Add Auditorium', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/owner/theaters').as('getTheaters')
    cy.visit('/AddAuditorium')
    cy.wait('@getTheaters', { timeout: 10000 })
    cy.wait(1000)
  })

  it('should load add auditorium page', () => {
    cy.url().should('include', '/AddAuditorium')
    cy.contains('Add New Auditorium').should('be.visible')
  })

  it('should display theater selection', () => {
    cy.get('select#theater_id').should('be.visible')
    cy.get('select#theater_id option').should('have.length.at.least', 1)
  })

  it('should display all input fields', () => {
    cy.get('input#name').should('be.visible')
    cy.get('input#total_seats').should('be.visible')
    cy.get('input#seats_per_row').should('be.visible')
  })

  it('should have submit button', () => {
    cy.get('button.btn-primary').should('be.visible')
  })

})
