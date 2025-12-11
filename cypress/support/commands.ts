/// <reference types="cypress" />

// Custom commands for Owner features

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Wait for toast notification to appear
       */
      waitForToast(type?: 'success' | 'error'): Chainable<void>
    }
  }
}

Cypress.Commands.add('waitForToast', (type = 'success') => {
  cy.get(`.toast-${type}`, { timeout: 5000 }).should('be.visible')
})

export {}