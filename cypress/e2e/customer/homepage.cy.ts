// cypress/e2e/customer/homepage.cy.ts
describe('Home Page', () => {
  const BACKEND_URL = 'http://localhost:5173'; // replace with your dev URL

  const mockLocations = [
    { id: 1, city: 'Oulu', name: 'Oulu Cinema', address: '123 Main St', phone: '1234567890' },
    { id: 2, city: 'Helsinki', name: 'Helsinki Cinema', address: '456 Side St', phone: '0987654321' },
  ];

  const mockMovies = [
    { 
      id: 101,
      title: 'Avengers',
      genre: 'Action',
      duration: 150,
      age_rating: '13+',
      description: 'Superheroes assemble',
      poster_url: '/mock-avengers.jpg',
      trailer_url: '/mock-trailer.mp4',
    },
    {
      id: 102,
      title: 'Inception',
      genre: 'Sci-Fi',
      duration: 148,
      age_rating: '13+',
      description: 'Dreams within dreams',
      poster_url: '/mock-inception.jpg',
      trailer_url: '/mock-trailer.mp4',
    }
  ];

  beforeEach(() => {
    // Set selectedCity to prevent /null fetch
    localStorage.setItem('selectedCity', 'Oulu');

    // Intercept locations API
    cy.intercept('GET', '**/api/customer/locations', {
      statusCode: 200,
      body: mockLocations,
    }).as('getLocations');

    // Intercept movies API
    cy.intercept('GET', `**/api/customer/location/movies?city=Oulu`, {
      statusCode: 200,
      body: mockMovies,
    }).as('getMovies');

    cy.visit(`${BACKEND_URL}/home`);
  });

  it('should fetch and render movie posters', () => {
    // Wait for both API calls
    cy.wait('@getLocations');
    cy.wait('@getMovies');

    // Posters are rendered
    cy.get('.poster-grid img').should('have.length', mockMovies.length);

    // Check src attribute of first poster
    cy.get('.poster-grid img').first().should('have.attr', 'src', '/mock-avengers.jpg');
  });

  it('should navigate to movie page on poster click', () => {
    cy.wait('@getLocations');
    cy.wait('@getMovies');

    // Click first poster
    cy.get('.poster-grid img').first().click();

    // Verify navigation by URL (contains movie id)
    cy.url().should('include', `/movie/${mockMovies[0].id}`);
  });
});
