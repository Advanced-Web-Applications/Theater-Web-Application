describe('template spec', () => {
  beforeEach(() => {
    cy.viewport("iphone-x")
    cy.visit('/')
  })
  it('passes', () => {
    cy.visit('localhost:5173/StaffDashboard')
  })
})