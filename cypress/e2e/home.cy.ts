describe('Home Page', () => {
  beforeEach(() => {
    // Visit homepage trước mỗi test
    cy.visit('/')
  })

  it('should display the title', () => {
    cy.get('h1').should('have.text','Hello World updated')
  })
})