describe('Staff Authentication', () => {
  
  beforeEach(() => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token-123456',
        role: 'staff',
        theater_id: 1,
        city: 'Oulu',
        user: { 
          id: 1, 
          email: 'staff@test.com',
          name: 'Test Staff'
        }
      }
    }).as('loginRequest');

    //
    cy.visit('/login', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('selectedCity', 'Oulu') 
      }
    })

    // type in email and password, and submit
    cy.get('input[type="email"]').type('any_staff@test.com') 
    cy.get('input[type="password"]').type('any_password')
    cy.get('button[type="submit"]').click()
    
    //waiting for login request to complete
    cy.wait('@loginRequest');

    cy.url().should('include', '/StaffHomePage')
  })

  it('should redirect to dashboard after login', () => {
      //try to verify navbar exists
      cy.get('.staffNavTheaterName').should('exist')
  })

  it('should logout successfully', () => {
    cy.get('.staffNavLogout').click()
    cy.url().should('include', '/login')
  })
})