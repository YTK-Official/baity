describe('template spec', () => {
  it('check all pages navigation', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Home').click();
    cy.url().should('eq', 'http://localhost:3000/');

    cy.contains('Contact us').click();
    cy.url().should('eq', 'http://localhost:3000/contact');
    cy.visit('http://localhost:3000');

    cy.contains('Chefs').click();
    cy.url().should('eq', 'http://localhost:3000/chefs');
    cy.visit('http://localhost:3000');

    cy.contains('New Arrivals').click();
    cy.url().should('eq', 'http://localhost:3000/products/new-arrival');
    cy.visit('http://localhost:3000');

    cy.contains('All Products').click();
    cy.url().should('eq', 'http://localhost:3000/products');
    cy.visit('http://localhost:3000');

    cy.contains('Login').click();
    cy.url().should('eq', 'http://localhost:3000/auth/login');
  });
});
