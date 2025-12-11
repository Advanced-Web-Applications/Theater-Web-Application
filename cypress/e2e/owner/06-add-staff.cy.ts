describe('Add Staff', () => {
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

    cy.visit('/AddStaff')
    cy.wait('@getTheaters')
  })

  it('should load add staff page', () => {
    cy.url().should('include', '/AddStaff')
    cy.contains('Add New Staff').should('be.visible')
  })

  it('should display all form fields', () => {
    cy.get('input#email').should('be.visible')
    cy.get('input#username').should('be.visible')
    cy.get('input#phone').should('be.visible')
    cy.get('select#theater_id').should('be.visible')
  })

  it('should have theater selection dropdown', () => {
    cy.get('select#theater_id').should('be.visible')
    cy.get('select#theater_id option').should('have.length.at.least', 1)
  })

  it('should have submit button', () => {
    cy.get('button.btn-primary').should('be.visible')
  })
})
