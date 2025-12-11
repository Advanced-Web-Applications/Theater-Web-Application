describe('Add Movie', () => {
  beforeEach(() => {
    cy.visit('/AddMovie')
    cy.wait(1000)
  })

  it('should load add movie page', () => {
    cy.url().should('include', '/AddMovie')
    cy.contains('Add New Movie').should('be.visible')
  })

  it('should display all form fields', () => {
    cy.get('input#title').should('be.visible')
    cy.get('textarea#description').should('be.visible')
    cy.get('input#genre').should('be.visible')
    cy.get('input#duration').should('be.visible')
    cy.get('select#age_rating').should('be.visible')
    cy.get('input#rating').should('be.visible')
    cy.get('input#release_date').should('be.visible')
    cy.get('input#poster_url').should('be.visible')
    cy.get('input#trailer_url').should('be.visible')
  })

  it('should display TMDB search section', () => {
    cy.contains('Search TMDB Database').should('be.visible')
    cy.get('input.search-input').should('be.visible')
    cy.get('button.btn-search').should('be.visible')
  })

  it('should have submit button', () => {
    cy.get('button.btn-primary').should('be.visible')
  })

  it('should show poster preview when URL is entered', () => {
    cy.get('input#poster_url').clear().type('https://example.com/poster.jpg')
    cy.get('.poster-preview').should('exist')
  })
})
