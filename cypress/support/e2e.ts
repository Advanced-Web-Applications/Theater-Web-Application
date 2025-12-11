// ***********************************************************
// This file is processed and loaded automatically before test files.
// ***********************************************************

import './commands'
import './auth-commands'

// Ignore uncaught exceptions from app
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

// Auto login as owner before each test and mock auth verification
beforeEach(() => {
  // Mock auth verification API
  cy.intercept('GET', '**/api/auth/verify', {
    statusCode: 200,
    body: {
      success: true,
      role: 'owner',
      user_id: 1,
      email: 'owner@test.com'
    }
  }).as('verifyAuth')

  // Set token in localStorage
  cy.window().then((window) => {
    window.localStorage.setItem('token', 'mock-jwt-token-for-testing')
  })
})