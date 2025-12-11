describe('Add Theater', () => {
  beforeEach(() => {
    cy.visit('/AddTheater')
    cy.wait(1000)
  })

  it('should load add theater page', () => {
    cy.url().should('include', '/AddTheater')
    cy.contains('Add New Theater').should('be.visible')
  })

  it('should display all form fields', () => {
    cy.get('input[type="text"]').should('have.length.at.least', 2)
    cy.get('input[type="tel"]').should('exist')
    cy.get('textarea').should('exist')
  })

  it('should display theater name input', () => {
    cy.get('input#name').should('be.visible')
    cy.get('input#city').should('be.visible')
    cy.get('input#phone').should('be.visible')
    cy.get('textarea#address').should('be.visible')
  })

  it('should have submit button', () => {
    cy.get('button.btn-primary').should('be.visible').and('contain', 'Add Theater')
  })
})
