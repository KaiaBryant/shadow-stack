const BASE_URL = "http://localhost:5173"; 
// 👆 Change if your app runs on a different port (3000, 4173, etc)

describe("Header navbar behavior", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  // ------------------ BASE VISIBILITY TESTS ------------------

  it("always shows Home and Leaderboard links", () => {
    cy.visit(`${BASE_URL}/`);

    cy.contains("a", "Home").should("be.visible");
    cy.contains("a", "Leaderboard").should("be.visible");
  });

  it("does NOT show Levels when username/character_id are missing", () => {
    cy.visit(`${BASE_URL}/`);

    cy.contains("a", "Levels").should("not.exist");
  });

  it("shows Levels when username AND character_id exist", () => {
    cy.visit(`${BASE_URL}/`, {
      onBeforeLoad(win) {
        win.localStorage.setItem("username", "jaimer");
        win.localStorage.setItem("character_id", "1");
      },
    });

    cy.contains("a", "Levels").should("be.visible");
  });

  // ------------------ LOGOUT VISIBILITY CASES ------------------

  it("shows Logout when username exists and no admin_token", () => {
    cy.visit(`${BASE_URL}/`, {
      onBeforeLoad(win) {
        win.localStorage.setItem("username", "jaimer");
      },
    });

    cy.contains("button", "Logout").should("be.visible");
  });

  it("shows Logout when session_id exists and no admin_token", () => {
    cy.visit(`${BASE_URL}/`, {
      onBeforeLoad(win) {
        win.localStorage.setItem("session_id", "abc123");
      },
    });

    cy.contains("button", "Logout").should("be.visible");
  });

  it("does NOT show Logout when admin_token exists (admin mode)", () => {
    cy.visit(`${BASE_URL}/`, {
      onBeforeLoad(win) {
        win.localStorage.setItem("username", "jaimer");
        win.localStorage.setItem("admin_token", "secret-admin");
      },
    });

    cy.contains("button", "Logout").should("not.exist");
  });

  // ------------------ MOBILE NAV TEST ------------------

  it("mobile menu: hamburger opens menu and shows Logout when logged in", () => {
    cy.viewport(375, 667); // simulate iPhone size

    cy.visit(`${BASE_URL}/`, {
      onBeforeLoad(win) {
        win.localStorage.setItem("username", "jaimer");
      },
    });

    // open hamburger
    cy.get("button.hamburger").click();

    // confirm mobile menu opened
    cy.get(".nav-menu.mobile-menu").should("have.class", "open");

    // search for Logout strictly inside mobile menu (not desktop)
    cy.get(".nav-menu.mobile-menu.open").within(() => {
      cy.contains("button", "Logout").should("be.visible");
    });
  });
});
