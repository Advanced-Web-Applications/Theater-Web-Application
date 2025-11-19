/// <reference types="cypress" />

describe('Home Page', () => {
  beforeEach(() => {
    // Visit homepage before each test
    cy.visit('/')
  })

  it('should display locations options', () => {
    cy.get('h2').should('contain','Choose your location')
  })
})