/// <reference types="cypress" />

describe('Home Page', () => {
  beforeEach(() => {
    // Visit homepage before each test
    cy.visit('/', {
      onBeforeLoad(win) {
        win.loadStripe = () => ({
          elements: () => ({}),
        })
      }
    })
  })

  it('should display locations options', () => {
    cy.get('h2').should('contain','Choose your location')
  })
})