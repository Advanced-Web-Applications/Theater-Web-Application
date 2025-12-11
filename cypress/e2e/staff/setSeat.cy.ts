describe('Staff Set Seat (Maintenance) Flow', () => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const mockStartTime = `${dateStr}T14:00:00`; 

  const THEATER_ID = 1;
  const AUDITORIUM_ID = 1;
  const SHOWTIME_ID = 555;

  beforeEach(() => {// try to intercept all necessary API calls
    cy.intercept('GET', `**/api/staff/theaters/${THEATER_ID}`, {
      statusCode: 200,
      body: { id: THEATER_ID, name: 'Oulu Theater' }
    }).as('getTheater');

    cy.intercept('GET', `**/api/staff/showtimes/${AUDITORIUM_ID}`, {
      statusCode: 200,
      body: [
        {
          id: SHOWTIME_ID,
          movie_title: 'Test Movie For Seats',
          start_time: mockStartTime,
          end_time: `${dateStr}T16:00:00`,
          clean_end_time: `${dateStr}T16:30:00`
        }
      ]
    }).as('getShowtimes');

    cy.intercept('GET', `**/api/staff/seats/showtimes/${SHOWTIME_ID}`, {
      statusCode: 200,
      body: {
        total_seats: 6,
        seats_per_row: 3,
        auditorium_id: AUDITORIUM_ID
      }
    }).as('getLayout');
    
    // Mock seat status: seat 1 booked, seat 2 maintenance
    cy.intercept('GET', `**/api/staff/seats/showtimes/${SHOWTIME_ID}/status`, {
      statusCode: 200,
      body: [
        { seat_number: 1, status: 'booked' },
        { seat_number: 2, status: 'maintenance' } 
      ]
    }).as('getSeatStatus');

    cy.intercept('POST', '**/api/staff/seats/save', {
      statusCode: 200,
      body: { message: 'Success' }
    }).as('saveSeats');

    // Stub window.alert
    const alertStub = cy.stub().as('alertStub');
    cy.on('window:alert', alertStub);
  });

  it('should load grid, toggle maintenance status, and save', () => {// 1. Visit Set Seat page
    cy.visit(`/StaffSetSeat/${THEATER_ID}/${AUDITORIUM_ID}`, {
      onBeforeLoad: (win) => { win.localStorage.setItem('selectedCity', 'Oulu') }
    });

    cy.wait('@getTheater');
    cy.wait('@getShowtimes'); 
    
    cy.wait('@getLayout');
    cy.wait('@getSeatStatus');
    cy.contains('.time-box', 'Test Movie For Seats').should('have.class', 'selected');

    cy.get('.seatForStaff').should('have.length', 6);

    cy.contains('.seatForStaff', '1') 
      .should('have.class', 'unavailable')
      .should('have.css', 'background-color', 'rgb(255, 77, 77)');

    cy.contains('.seatForStaff', '2')
      .should('have.class', 'maintenance')
      .should('have.css', 'background-color', 'rgb(128, 128, 128)'); 

    cy.contains('.seatForStaff', '3')
      .should('have.class', 'available')
      .should('have.css', 'background-color', 'rgb(54, 89, 124)'); 


    cy.contains('.seatForStaff', '3').click();
    cy.contains('.seatForStaff', '3')
      .should('have.class', 'maintenance')
      .should('have.css', 'background-color', 'rgb(128, 128, 128)');

    cy.contains('.seatForStaff', '2').click();
    cy.contains('.seatForStaff', '2')
      .should('have.class', 'available');

    cy.contains('.seatForStaff', '1').click();
    cy.contains('.seatForStaff', '1')
      .should('have.class', 'unavailable');



    cy.contains('button', 'Save').click();

    cy.wait('@saveSeats').then((interception) => {// try to verify request body
      const body = interception.request.body;
      
      expect(body.showtime_id).to.equal(SHOWTIME_ID);
      
      const changeForSeat3 = body.seats.find((s: any) => s.seat_number === 3);
      const changeForSeat2 = body.seats.find((s: any) => s.seat_number === 2);

      expect(changeForSeat3).to.exist;
      expect(changeForSeat3.status).to.equal('maintenance');

      expect(changeForSeat2).to.exist;
      expect(changeForSeat2.status).to.equal('available');
    });

    // Check alert
    cy.get('@alertStub').should('have.been.calledWith', 'Seat status saved successfully');
  });
});