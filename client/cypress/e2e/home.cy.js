const BASE_URL = "http://localhost:5173"; 

describe("Home page - Get Started navigation", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("loads the home page and shows Get Started button", () => {
    cy.visit(`${BASE_URL}/`);

    cy.contains("Shadow Stack").should("be.visible");
    cy.contains("button", "Get Started").should("be.visible");
  });

  it("redirects to /createuser when no username and no character_id", () => {
    cy.visit(`${BASE_URL}/`);

    cy.contains("button", "Get Started").click();

    cy.location("pathname").should("eq", "/createuser");
  });

  it("redirects to /character-select when username exists but no character_id", () => {
    cy.visit(`${BASE_URL}/`, {
      onBeforeLoad(win) {
        win.localStorage.setItem("username", "jaimer");
      },
    });

    cy.contains("button", "Get Started").click();

    cy.location("pathname").should("eq", "/character-select");
  });

  it("redirects to /levels when username and character_id exist", () => {
    cy.visit(`${BASE_URL}/`, {
      onBeforeLoad(win) {
        win.localStorage.setItem("username", "jaimer");
        win.localStorage.setItem("character_id", "1");
      },
    });

    cy.contains("button", "Get Started").click();

    cy.location("pathname").should("eq", "/levels");
  });
});
