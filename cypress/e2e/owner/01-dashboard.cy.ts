describe('Owner Dashboard', () => {
  beforeEach(() => {
    // Mock API response for dashboard stats
    cy.intercept('GET', '**/api/owner/dashboard-stats', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          statistics: {
            totalTicketsSold: 1250,
            totalRevenue: 25000.50,
            totalTheaters: 5,
            totalMovies: 45
          },
          monthlyRevenue: [
            { month_name: 'January', month_number: 1, year: 2024, revenue: '2000.00', total_tickets: '100' },
            { month_name: 'February', month_number: 2, year: 2024, revenue: '2500.00', total_tickets: '125' },
            { month_name: 'March', month_number: 3, year: 2024, revenue: '3000.00', total_tickets: '150' }
          ]
        }
      }
    }).as('getDashboard')

    cy.visit('/OwnerDashboard')
    cy.wait('@getDashboard')
  })

  it('should load dashboard page successfully', () => {
    cy.url().should('include', '/OwnerDashboard')
    cy.get('.owner-dashboard').should('exist')
  })

  it('should display all statistics cards', () => {
    cy.contains('TOTAL TICKETS SOLD').should('be.visible')
    cy.contains('TOTAL REVENUE').should('be.visible')
    cy.contains('TOTAL THEATERS').should('be.visible')
    cy.contains('TOTAL MOVIES').should('be.visible')
  })

  it('should display revenue chart', () => {
    cy.contains('REVENUE OVERVIEW').should('be.visible')
    cy.get('canvas').should('exist')
  })

  it('should display statistics values', () => {
    cy.contains('1,250').should('be.visible') // Total tickets
    cy.contains('€25,000.50').should('be.visible') // Total revenue
  })
})
