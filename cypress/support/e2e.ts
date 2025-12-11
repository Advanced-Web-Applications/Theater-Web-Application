// ***********************************************************
// This file is processed and loaded automatically before test files.
// ***********************************************************

import './commands'
import './auth-commands'

// Ignore uncaught exceptions from app
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

// Auto login as owner before each test (if needed)
// Uncomment this when you add authentication to your app
// beforeEach(() => {
//   cy.mockAuth('owner')
// })