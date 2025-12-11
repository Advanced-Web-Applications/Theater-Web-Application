describe('Staff Authentication', () => {
  
  beforeEach(() => {
    cy.intercept('GET', '**/api/staff/theaters/*', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Oulu Theater',
        rooms: [] 
      }
    }).as('getTheater');
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token-123456',
        role: 'staff',      
        theater_id: 1,      
        theaterId: 1,       
        city: 'Oulu',       
        user: {
          id: 1,
          email: 'staff@test.com',
          name: 'Test Staff'
        }
      }
    }).as('loginRequest');

    cy.visit('/login', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('selectedCity', 'Oulu') 
      }
    })

    cy.get('input[type="email"]').type('any_staff@test.com') 
    cy.get('input[type="password"]').type('any_password')
    cy.get('button[type="submit"]').click()
    
    cy.wait('@loginRequest');

    cy.url().should('include', '/StaffHomePage')
  })

  it('should redirect to dashboard after login', () => {
      cy.wait('@getTheater');
      
      cy.get('.staffNavTheaterName').should('exist')
  })

  it('should logout successfully', () => {
    cy.wait('@getTheater');

    cy.get('.staffNavLogout').click()
    
    cy.url().should('include', '/login')
  })
})