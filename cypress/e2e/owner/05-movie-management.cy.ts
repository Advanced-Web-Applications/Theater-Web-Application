describe('Movie Management', () => {
  beforeEach(() => {
    // Mock movies API - return array directly
    cy.intercept('GET', '**/api/owner/movies*', {
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
        data: [
          { status: 'now_showing', count: 1 },
          { status: 'upcoming', count: 0 },
          { status: 'ended', count: 0 }
        ]
      }
    }).as('getStats')

    cy.visit('/MovieManagement')
    cy.wait(['@getMovies', '@getGenres', '@getStats'])
  })

  it('should load movie management page', () => {
    cy.url().should('include', '/MovieManagement')
    cy.contains('MOVIE MANAGEMENT').should('be.visible')
  })

  it('should display search and filters', () => {
    cy.get('.search-input').should('be.visible')
    cy.get('.filter-select').should('have.length.at.least', 2)
  })

  it('should display movie cards', () => {
    cy.get('.movie-card').should('exist')
    cy.contains('Test Movie 1').should('be.visible')
  })
})
