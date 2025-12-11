describe('Staff List', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/owner/staff').as('getStaff')
    cy.intercept('GET', '**/api/owner/theaters').as('getTheaters')
    cy.visit('/StaffList')
    cy.wait('@getStaff', { timeout: 10000 })
    cy.wait(1000)
  })

  it('should load staff list page', () => {
    cy.url().should('include', '/StaffList')
    cy.contains('Staff Management').should('be.visible')
  })

  it('should display search box', () => {
    cy.get('input[placeholder*="Search"]').should('be.visible')
  })

  it('should display staff grid', () => {
    cy.get('body').then($body => {
      if ($body.find('.staff-grid').length > 0) {
        cy.get('.staff-grid').should('exist')
      } else {
        cy.contains('No staff found').should('be.visible')
      }
    })
  })

  it('should navigate to edit staff', () => {
    cy.get('body').then($body => {
      if ($body.find('.staff-card').length > 0) {
        cy.get('.staff-card').first().find('button.edit').click()
        cy.wait(1000)
        cy.url().should('include', '/EditStaff')
      }
    })
  })
})
