/// <reference types="cypress" />
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Cannot read properties of undefined') && err.stack?.includes('initStripe2')) {
    return false
  }
})

describe('Home Page', () => {
  beforeEach(() => {
    // Visit homepage before each test
    cy.visit('/', {
      onBeforeLoad(win) {
        Object.defineProperty(win, 'loadStripe', {
          configurable: true,
          writable: false,
          value: () => ({
            elements: () => ({})
          }),
        })
      }
    })
  })

  it('should display locations options', () => {
    cy.get('h2').should('contain','Choose your location')
  })
})