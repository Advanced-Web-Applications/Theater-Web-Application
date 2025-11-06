describe('Staff Dashboard test', () => {
  beforeEach(() => {
    cy.viewport('iphone-6')
    cy.visit('http://localhost:5173/StaffHomePage') 
  })

  it('should navigate to Staff Home Page', () => {
    cy.visit('/StaffHomePage') 
    cy.contains('Auditorium') 
    cy.contains('Set times')
    cy.contains('See table')
    cy.contains('Set seat')
  })

  it('should navigate to Set Show Times page', () => {
    cy.get('.roomCard', { timeout: 10000 })
      .should('exist')
      .first()
      .then(($el) => {
        cy.wrap($el)
          .find('.auditoriumButton') 
          .invoke('css', {
            opacity: '1',
            'pointer-events': 'auto',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          });
      });

    cy.contains('button', 'Set times')
      .should('exist')
      .click({ force: true });

    cy.url().should('include', '/StaffSetTimes');
  });

  it('should navigate to Set Seats page', () => {
    cy.get('.roomCard', { timeout: 10000 })
      .should('exist')
      .first()
      .then(($el) => {
        cy.wrap($el)
          .find('.auditoriumButton') 
          .invoke('css', {
            opacity: '1',
            'pointer-events': 'auto',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          });
      });

    cy.contains('button', 'Set seat')
      .should('exist')
      .click({ force: true });

    cy.url().should('include', '/StaffSetSeat');
  });

})
