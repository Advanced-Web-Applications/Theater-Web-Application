describe('Staff See Table - Edit & Delete Flow', () => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0]; 
  
  const mockStartTime = `${dateStr}T14:00:00.000Z`; 

  beforeEach(() => {
    cy.intercept('GET', '**/api/staff/theaters/*', {
      statusCode: 200,
      body: { id: 1, name: 'Oulu Theater', rooms: [{ auditoriumNumber: 1, name: 'Room 1' }] }
    }).as('getTheater');

    cy.intercept('GET', '**/api/staff/showtimes/*', {
      statusCode: 200,
      body: [
        {
          id: 999,
          movie_title: 'Test Movie For Edit',
          start_time: mockStartTime, 
          duration: 120, 
          end_time: `${dateStr}T16:00:00.000Z`,
          clean_end_time: `${dateStr}T16:30:00.000Z`
        }
      ]
    }).as('getShowtimes');

    cy.intercept('PUT', '**/api/staff/showtimes/999', {
      statusCode: 200,
      body: { message: 'Update successful' }
    }).as('updateShowtime');
)
    cy.intercept('DELETE', '**/api/staff/showtimes/999', {
      statusCode: 200,
      body: { message: 'Delete successful' }
    }).as('deleteShowtime');
  });

  it('should navigate to See Table, edit a showtime, and save', () => {
    cy.visit('/StaffHomePage/1', {
      onBeforeLoad: (win) => { win.localStorage.setItem('selectedCity', 'Oulu') }
    });

    cy.get('.roomCard', { timeout: 10000 }).should('exist');

    cy.get('.roomCard').first().within(() => {
      cy.contains('button', 'See Table').click({ force: true });
    });

    cy.url().should('include', '/StaffSeeTable');
    cy.wait('@getShowtimes');

    cy.contains('.movieTitleInfo', 'Test Movie For Edit').should('be.visible');

    //open Modal
    cy.contains('.movieTitleInfo', 'Test Movie For Edit').click();
    cy.get('.modal').should('be.visible');

    cy.get('.modal .timeSelect').eq(0).select('16'); 
    cy.get('.modal .timeSelect').eq(1).select('30'); 

    // click Save
    cy.contains('button', 'Save').click();

    cy.wait('@updateShowtime').then((interception) => {
      const body = interception.request.body;
      expect(body.time).to.equal(16);
      expect(body.minute).to.equal(30);
      expect(body.date).to.include(dateStr);
    });

    cy.get('.modal').should('not.exist');
  });

  it('should delete a showtime successfully', () => {
    cy.visit('/StaffHomePage/1', {
      onBeforeLoad: (win) => { win.localStorage.setItem('selectedCity', 'Oulu') }
    });
    
    cy.get('.roomCard').first().within(() => {
      cy.contains('button', 'See Table').click({ force: true });
    });
    cy.wait('@getShowtimes');

    // open Modal
    cy.contains('.movieTitleInfo', 'Test Movie For Edit').click();

    // click Delete
    cy.contains('button', 'Delete').click();

    cy.wait('@deleteShowtime').then((interception) => {
      expect(interception.request.url).to.include('/999');
    });

    //close modal
    cy.get('.modal').should('not.exist');
  });
});