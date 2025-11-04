/// <reference types="cypress" />

describe('Home Page', () => {
  beforeEach(() => {
    // Visit homepage before each test
    cy.visit('/')
  })

  it('should display the title', () => {
    cy.get('h1').should('contain','Hello World updated')
  })
})