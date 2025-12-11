describe('Add Auditorium', () => {
  beforeEach(() => {
    // Mock theaters API
    cy.intercept('GET', '**/api/owner/theaters', {
      statusCode: 200,
      body: {
        success: true,
        data: [
          { theater_id: 1, name: 'Theater 1', city: 'New York' },
          { theater_id: 2, name: 'Theater 2', city: 'Los Angeles' }
        ]
      }
    }).as('getTheaters')

    cy.visit('/AddAuditorium')
    cy.wait('@getTheaters')
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
