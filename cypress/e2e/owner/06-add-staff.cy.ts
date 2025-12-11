describe('Add Staff', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/owner/theaters').as('getTheaters')
    cy.visit('/AddStaff')
    cy.wait('@getTheaters', { timeout: 10000 })
    cy.wait(1000)
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
