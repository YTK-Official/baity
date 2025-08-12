describe('Checkout', () => {
  it('go to first product page', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Available')
      .parent()
      .parent()
      .find('a')
      .contains(/view/i)
      .first()
      .click({ force: true });
  });
});
