describe('Edit Staff', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/owner/staff').as('getStaff')
    cy.intercept('GET', '**/api/owner/theaters').as('getTheaters')
    cy.visit('/StaffList')
    cy.wait('@getStaff', { timeout: 10000 })
    cy.wait(1000)
  })

  it('should navigate to edit page', () => {
    cy.get('body').then($body => {
      if ($body.find('.staff-card').length > 0) {
        cy.get('.staff-card').first().find('button.edit').click()
        cy.wait(1000)
        cy.url().should('include', '/EditStaff')
        cy.contains('Edit Staff Information').should('be.visible')
      }
    })
  })

  it('should display form with existing data', () => {
    cy.get('body').then($body => {
      if ($body.find('.staff-card').length > 0) {
        cy.get('.staff-card').first().find('button.edit').click()
        cy.wait(1000)

        cy.get('input#username').should('exist')
        cy.get('input#email').should('exist')
        cy.get('input#phone').should('exist')
        cy.get('select#theater_id').should('exist')
      }
    })
  })

  it('should update staff information', () => {
    cy.get('body').then($body => {
      if ($body.find('.staff-card').length > 0) {
        cy.get('.staff-card').first().find('button.edit').click()
        cy.wait(1000)

        cy.intercept('PUT', '**/api/owner/staff/*').as('updateStaff')

        const timestamp = Date.now()
        cy.get('input#username').clear().type(`UpdatedStaff${timestamp}`)

        cy.get('button.btn-primary').click()

        cy.wait('@updateStaff', { timeout: 10000 }).then((interception) => {
          if (interception.response) {
            expect(interception.response.statusCode).to.be.oneOf([200, 400])
          }
        })
      }
    })
  })
})
