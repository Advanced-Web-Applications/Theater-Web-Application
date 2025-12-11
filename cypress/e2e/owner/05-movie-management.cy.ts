describe('Movie Management', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/owner/movies*').as('getMovies')
    cy.intercept('GET', '**/api/owner/movies/genres').as('getGenres')
    cy.intercept('GET', '**/api/owner/movies/stats').as('getStats')

    cy.visit('/MovieManagement')
    cy.wait(['@getMovies', '@getGenres', '@getStats'], { timeout: 10000 })
    cy.wait(1500)
  })

  it('should display search and filters', () => {
    cy.get('input[placeholder*="Search"]').should('be.visible')
    cy.get('select').should('have.length.at.least', 2)
  })

  it('should filter by status', () => {
    cy.get('select').eq(0).select('now_showing')
    cy.wait('@getMovies', { timeout: 10000 })
    cy.wait(1000)
  })
})
