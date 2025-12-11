it('should set showtime for Zootopia 2 at 13:00 in the first room', () => {
    cy.intercept('GET', '**/api/staff/movies', {
      statusCode: 200,
      body: [
        { id: 101, title: 'Zootopia 2' }, 
        { id: 102, title: 'Superman' }
      ]
    }).as('getMovies');

    cy.intercept('POST', '**/api/staff/showtimes', {
      statusCode: 201,
      body: { message: 'Showtime saved successfully' }
    }).as('saveShowtime');

    const alertStub = cy.stub().as('alertStub');
    cy.on('window:alert', alertStub);

    cy.visit('/StaffHomePage/1', {
        onBeforeLoad: (win) => { win.localStorage.setItem('selectedCity', 'Oulu') }
    });

    cy.get('.roomCard').first().within(() => {
        cy.contains('button', 'Set Times').click({ force: true });
    });

    cy.url().should('include', '/StaffSetTimes');

    cy.wait('@getMovies');

    cy.get('#MovieName').select('Zootopia 2');

    const today = new Date().toISOString().split('T')[0];
    cy.get('#ShowDate').type(today);

    cy.get('.timeSelect').eq(0).select('19'); 
    cy.get('.timeSelect').eq(1).select('00'); 

    // Click Save
    cy.contains('button', 'Save').click();

    cy.wait('@saveShowtime').then((interception) => {
      const requestBody = interception.request.body;
      
      expect(requestBody.movie_id).to.equal(101);
      expect(requestBody.start_time).to.include('19:00');
    });

    cy.get('@alertStub').should('have.been.calledWith', 'Showtime saved!');
    
    cy.get('.timeSelect').eq(0).should('have.value', '');
  });
