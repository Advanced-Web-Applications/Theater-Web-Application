describe('Staff Home Page iPhone 15 Pro Max View', () => {
  beforeEach(() => {
    cy.viewport(450, 932);  // iPhone 15 Pro Max
    cy.visit('staffHomePage/1');
  });

  it('show room cards on iPhone 15 Pro Max', () => {
    cy.get('.roomCard').should('exist');
  });

  it('if set seat action buttons are clickable', () => {
    cy.get('.roomCard').first().within(() => {
      cy.get('.actionButton').first().click();
    });
  });

  it('if set time action buttons are clickable', () => {
    cy.get('.roomCard').first().within(() => {
      cy.get('.actionButton').eq(1).click();
    });
  });

  it('if see table action buttons are clickable', () => {
    cy.get('.roomCard').first().within(() => {
      cy.get('.actionButton').last().click();
    });
  });
});