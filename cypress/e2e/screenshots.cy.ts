const chefPages = [
  '/chef',
  '/chef/products',
  '/chef/products/new',
  '/chef/orders',
];

describe('Chef Pages Screenshots', () => {
  it('should login', () => {
    cy.viewport(1920, 1280);

    cy.visit('/auth/login');

    cy.get('input[name="email"]').type('test642@yahoo.com');
    cy.get('input[name="password"]').type('123456aA');
    cy.intercept('POST', '**/auth/login').as('login');
    cy.get('form').submit().wait('@login');

    for (const page of chefPages) {
      cy.visit(page);
      cy.wait(4000); // wait for page to load, adjust if needed
      cy.screenshot(`chef${page.replace(/\//g, '_') || '_home'}`, {
        capture: 'fullPage',
        overwrite: true,
      });
    }
  });
});
