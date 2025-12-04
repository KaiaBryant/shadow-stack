// cypress/e2e/home.cy.js

describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/'); // Replace '/' with the actual route for the Home component
  });

  it('displays the title correctly', () => {
    cy.get('.home-title').should('have.text', 'Master Cybersecurity One Question at a Time');
  });

  it('displays the subtitle correctly', () => {
    cy.get('.lead').should('have.text', 'Built for aspiring analysts, students, and cybersecurity teams who want practical learning — not boring theory.');
  });

  it('navigates to the /createuser route when the Get Started button is clicked', () => {
    cy.get('.home-btn').click();
    cy.url().should('include', '/createuser'); // Replace '/createuser' with the actual route for the CreateUser component
  });
});