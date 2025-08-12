describe('template spec', () => {
  it('check all pages navigation', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Home');
    cy.contains('Contact');
    cy.contains('Chefs');
    cy.contains('New Arrivals');
    cy.contains('All Products');
    cy.contains('Login');
    cy.contains('en');
    cy.contains('Contact us');
    cy.contains('Best Chefs');
  });
});
