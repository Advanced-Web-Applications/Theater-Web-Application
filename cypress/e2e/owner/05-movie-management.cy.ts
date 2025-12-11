describe('Movie Management', () => {
  beforeEach(() => {
    // Mock genres API first (called first in component)
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
        data: [
          { status: 'now_showing', count: 1 },
          { status: 'upcoming', count: 0 },
          { status: 'ended', count: 0 }
        ]
      }
    }).as('getStats')

    // Mock movies API with any query params
    cy.intercept('GET', /\/api\/owner\/movies(\?.*)?$/, {
      statusCode: 200,
      body: {
        success: true,
        data: [
          {
            id: 1,
            title: 'Test Movie 1',
            status: 'now_showing',
            genre: 'Action',
            duration: 120,
            age_rating: 'PG-13',
            description: 'A test movie',
            poster_url: 'https://example.com/poster1.jpg',
            trailer_url: 'https://example.com/trailer1.mp4',
            created_at: '2024-01-01'
          }
        ]
      }
    }).as('getMovies')

    cy.visit('/MovieManagement', { timeout: 30000 })
    cy.wait('@getMovies', { timeout: 10000 })
  })

  it('should load movie management page', () => {
    cy.url().should('include', '/MovieManagement')
    cy.contains('MOVIE MANAGEMENT', { timeout: 10000 }).should('be.visible')
  })

  it('should display search box', () => {
    cy.get('.search-input', { timeout: 10000 }).should('be.visible')
  })

  it('should display filters', () => {
    cy.get('.filter-select', { timeout: 10000 }).should('exist')
  })
})
