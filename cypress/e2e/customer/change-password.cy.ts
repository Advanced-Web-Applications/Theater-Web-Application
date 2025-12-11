 describe('Change Password Page (Minimal CI Test)', () => {


  Cypress.Commands.add('login', () => {
    localStorage.setItem('token', 'fake-jwt-token');
  });

  beforeEach(() => {
    cy.login();
    localStorage.setItem('selectedCity', 'Oulu');

    cy.intercept('POST', '**/api/auth/change-password', {
      statusCode: 200,
      body: { message: 'Password changed successfully (MOCKED)' },
    }).as('changePassword');

  
    cy.visit('/change-password');
  });

  it('should successfully visit the page and display the title', () => {
    cy.url().should('include', '/change-password');
    cy.get('.change-password-title').should('contain', 'Change Password');
  });
  
  it('should successfully submit the form and show MOCKED success message', () => {
    cy.get('input[placeholder="Old Password"]').type('anyOldPass');
    cy.get('input[placeholder="New Password"]').type('anyNewPass');
    cy.get('button.update-button').click();

    cy.wait('@changePassword');

    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Password changed successfully (MOCKED)');
    });
  });
});