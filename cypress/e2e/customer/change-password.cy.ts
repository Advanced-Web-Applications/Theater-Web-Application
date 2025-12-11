// cypress/e2e/customer/change-password.cy.ts
describe('Change Password Page', () => {
  const BACKEND_URL = 'http://localhost:5173'; // replace with your dev URL

  // Custom commands to simulate login/logout
  Cypress.Commands.add('login', () => {
    localStorage.setItem('token', 'fake-jwt-token');
  });

  Cypress.Commands.add('logout', () => {
    localStorage.removeItem('token');
  });

  beforeEach(() => {
    // Simulate logged-in user
    cy.login();
    localStorage.setItem('selectedCity', 'Oulu');

    // Intercept change-password API before visiting page
    cy.intercept('POST', '**/api/auth/change-password', (req) => {
      const { oldPassword } = req.body;
      if (oldPassword === 'oldPassword123') {
        req.reply({
          statusCode: 200,
          body: { message: 'Password changed successfully' },
        });
      } else {
        req.reply({
          statusCode: 400,
          body: { message: 'Old password is incorrect' },
        });
      }
    }).as('changePassword');

    // Visit the change-password page
    cy.visit(`${BACKEND_URL}/change-password`);
    cy.get('.change-password-title').should('contain', 'Change Password');
  });

  describe('Form Rendering', () => {
    it('should display the change password form', () => {
      cy.get('input[placeholder="Old Password"]').should('exist');
      cy.get('input[placeholder="New Password"]').should('exist');
      cy.get('button.update-button').should('exist');
    });
  });

  describe('Form Validation', () => {
    it('should alert if fields are empty', () => {
      cy.get('button.update-button').click();

      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('Both old and new passwords are required');
      });
    });
  });

  describe('API Interaction', () => {
    it('should show success alert on valid submission', () => {
      cy.get('input[placeholder="Old Password"]').type('oldPassword123');
      cy.get('input[placeholder="New Password"]').type('newPassword456');
      cy.get('button.update-button').click();

      cy.wait('@changePassword').its('request.body').should('deep.equal', {
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword456',
      });

      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('Password changed successfully');
      });
    });

    it('should show error alert on failed submission', () => {
      cy.get('input[placeholder="Old Password"]').type('wrongOldPass');
      cy.get('input[placeholder="New Password"]').type('newPass123');
      cy.get('button.update-button').click();

      cy.wait('@changePassword');

      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('Old password is incorrect');
      });
    });
  });

  describe('Logout Button', () => {
    it('should logout from change-password page', () => {
      cy.get('button.logout-button').click();
      cy.url().should('include', '/');

      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null;
      });
    });
  });
});
