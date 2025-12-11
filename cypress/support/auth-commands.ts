/// <reference types="cypress" />

/**
 * Authentication commands for Cypress tests
 * These commands help bypass authentication in E2E tests
 */

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login as owner with valid credentials
       * @example cy.loginAsOwner()
       */
      loginAsOwner(): Chainable<void>

      /**
       * Login as staff with valid credentials
       * @example cy.loginAsStaff()
       */
      loginAsStaff(): Chainable<void>

      /**
       * Set authentication token directly (bypass login UI)
       * @param token - JWT token
       * @param role - User role (owner/staff/customer)
       * @example cy.setAuthToken('your-token', 'owner')
       */
      setAuthToken(token: string, role: string): Chainable<void>

      /**
       * Mock authentication without real API call
       * @param role - User role to mock
       * @example cy.mockAuth('owner')
       */
      mockAuth(role: 'owner' | 'staff' | 'customer'): Chainable<void>

      /**
       * Logout and clear authentication
       * @example cy.logout()
       */
      logout(): Chainable<void>
    }
  }
}

// Command: Login as Owner
Cypress.Commands.add('loginAsOwner', () => {
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:3000'

  // Option 1: Login through UI
  cy.session('owner-session', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('owner@test.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/OwnerDashboard')
  })

  // Option 2: Login through API (faster)
  // cy.request({
  //   method: 'POST',
  //   url: `${apiUrl}/api/auth/login`,
  //   body: {
  //     email: 'owner@test.com',
  //     password: 'password123'
  //   }
  // }).then((response) => {
  //   window.localStorage.setItem('authToken', response.body.token)
  //   window.localStorage.setItem('userRole', 'owner')
  // })
})

// Command: Login as Staff
Cypress.Commands.add('loginAsStaff', () => {
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:3000'

  cy.session('staff-session', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('staff@test.com')
    cy.get('input[type="password"]').type('password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/StaffDashboard')
  })
})

// Command: Set auth token directly
Cypress.Commands.add('setAuthToken', (token: string, role: string) => {
  cy.window().then((window) => {
    window.localStorage.setItem('authToken', token)
    window.localStorage.setItem('userRole', role)
    window.localStorage.setItem('userId', '1')
  })
})

// Command: Mock authentication (bypass backend)
Cypress.Commands.add('mockAuth', (role: 'owner' | 'staff' | 'customer') => {
  cy.window().then((window) => {
    // Set mock authentication data
    const mockToken = 'mock-jwt-token-for-testing'
    const mockUser = {
      id: 1,
      email: `${role}@test.com`,
      username: `Test ${role}`,
      role: role
    }

    window.localStorage.setItem('authToken', mockToken)
    window.localStorage.setItem('userRole', role)
    window.localStorage.setItem('user', JSON.stringify(mockUser))
  })

  // Intercept auth verification API calls
  cy.intercept('GET', '**/api/auth/verify', {
    statusCode: 200,
    body: {
      success: true,
      data: {
        id: 1,
        email: `${role}@test.com`,
        username: `Test ${role}`,
        role: role
      }
    }
  }).as('verifyAuth')

  // Intercept any protected API calls
  cy.intercept('GET', '**/api/owner/**', (req) => {
    req.headers['authorization'] = 'Bearer mock-jwt-token-for-testing'
  })
})

// Command: Logout
Cypress.Commands.add('logout', () => {
  cy.window().then((window) => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })
  cy.clearCookies()
})

export {}
