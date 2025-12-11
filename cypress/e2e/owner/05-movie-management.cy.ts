describe('Movie Management', () => {
  beforeEach(() => {
    // Mock movies API
    cy.intercept('GET', '**/api/owner/movies*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          movies: [
            {
              movie_id: 1,
              title: 'Test Movie 1',
              status: 'now_showing',
              genre: 'Action',
              rating: 8.5,
              poster_url: 'https://example.com/poster1.jpg'
            }
          ],
          pagination: { totalPages: 1, currentPage: 1, totalMovies: 1 }
        }
      }
    }).as('getMovies')

    // Mock genres API
    cy.intercept('GET', '**/api/owner/movies/genres', {
      statusCode: 200,
      body: {
        success: true,
        data: ['Action', 'Comedy', 'Drama']
      }
    }).as('getGenres')

    // Mock stats API
    cy.intercept('GET', '**/api/owner/movies/stats', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          total: 1,
          now_showing: 1,
          upcoming: 0,
          ended: 0
        }
      }
    }).as('getStats')

    cy.visit('/MovieManagement')
    cy.wait(['@getMovies', '@getGenres', '@getStats'])
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
