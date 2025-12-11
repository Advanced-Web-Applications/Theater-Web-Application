
//This part is for staff authentication tests
describe('Staff Authentication', () => {
  
  beforeEach(() => {
    cy.visit('/login', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('selectedCity', 'Oulu') 
      }
    })
    cy.get('input[type="email"]').type('pvantam2003@gmail.com') 
    cy.get('input[type="password"]').type('wdwki1tlqz9utqef')
    cy.get('button[type="submit"]').click()
    
    cy.url().should('include', '/StaffHomePage')
  })

  it('should redirect to dashboard after login', () => {
     cy.get('.staffNavTheaterName').should('exist')
  })

  it('should logout successfully', () => {
    cy.get('.staffNavLogout').click()

    cy.url().should('include', '/login')
  })
})
