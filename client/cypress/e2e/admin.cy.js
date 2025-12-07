const BASE_URL = "http://localhost:5173"; // 👈 change if your app runs on 3000 / 4173 etc.
const API_BASE = "https://shadow-stack.onrender.com/api/admin";

describe("Admin Dashboard", () => {
  const adminUsername = "shadow-admin";
  const adminToken = "test-token-123";

  // This runs before EVERY test
  beforeEach(() => {
    cy.clearLocalStorage();

    // Mock GET /users
    cy.intercept("GET", `${API_BASE}/users`, {
      statusCode: 200,
      body: [
        {
          id: 1,
          username: "alice",
          character_id: 2,
          created_at: "2024-12-01T12:00:00Z",
        },
        {
          id: 2,
          username: "bob",
          character_id: null,
          created_at: "2024-12-02T09:30:00Z",
        },
      ],
    }).as("getUsers");

    // Mock GET /summary
    cy.intercept("GET", `${API_BASE}/summary`, {
      statusCode: 200,
      body: [
        {
          user_id: 1,
          username: "alice",
          current_level: 3,
          score: 120,
          is_active: true,
        },
        {
          user_id: 2,
          username: "bob",
          current_level: 1,
          score: 40,
          is_active: false,
        },
      ],
    }).as("getSummary");

    // Visit admin page with token + username in localStorage
    cy.visit(`${BASE_URL}/admin`, {
      onBeforeLoad(win) {
        win.localStorage.setItem("admin_token", adminToken);
        win.localStorage.setItem("admin_username", adminUsername);
      },
    });

    // wait for both API calls to finish
    cy.wait("@getUsers");
    cy.wait("@getSummary");
  });

  // ---------- BASIC RENDERING ----------

  it("shows welcome message with admin username", () => {
    cy.contains("Welcome,").should("be.visible");
    cy.contains(adminUsername).should("be.visible");
  });

  it("renders the users table with mocked data", () => {
    cy.contains("h5", "Users").should("be.visible");

    // first scroll-container = Users table
    cy.get(".scroll-container").first().within(() => {
      cy.contains("td", "alice").should("be.visible");
      cy.contains("td", "bob").should("be.visible");
    });
  });

  it("renders the sessions table with mocked data", () => {
    cy.contains("h5", "User Sessions").should("be.visible");

    // second scroll-container/table-responsive = Sessions table
    cy.get(".scroll-container").eq(1).within(() => {
      cy.contains("td", "alice").should("be.visible");
      cy.contains("td", "bob").should("be.visible");
      cy.contains("td", "Yes").should("be.visible"); // is_active true
      cy.contains("td", "No").should("be.visible");  // is_active false
    });
  });

  // ---------- CREATE ADMIN ----------

  it("allows creating a new admin user", () => {
    cy.intercept("POST", `${API_BASE}/create-admin`, (req) => {
      // body should match what the form sends
      expect(req.body).to.deep.equal({
        username: "newadmin",
        password: "StrongPass!1",
        pin_code: "1234",
      });

      req.reply({
        statusCode: 201,
        body: { success: true },
      });
    }).as("createAdmin");

    // Click "Create New Admin" button
    cy.contains("button", "Create New Admin").click();

    // Fill form fields
    cy.get("form.admin-create-form").within(() => {
      cy.get("input").eq(0).type("newadmin");       // username
      cy.get("input").eq(1).type("StrongPass!1");   // password
      cy.get("input").eq(2).type("1234");           // pin
      cy.root().submit();
    });

    // Assert alert is shown
    cy.on("window:alert", (text) => {
      expect(text).to.contain("Admin created successfully");
    });

    cy.wait("@createAdmin");
  });

  // ---------- DELETE USER ----------

  it("allows deleting a user from the users table", () => {
    cy.intercept("DELETE", `${API_BASE}/users/1`, {
      statusCode: 200,
      body: { success: true },
    }).as("deleteUser");

    // Confirm dialog should return true
    cy.on("window:confirm", () => true);

    // Work ONLY inside the Users table (first .scroll-container)
    cy.get(".scroll-container").first().within(() => {
      // make sure alice is there first
      cy.contains("td", "alice").should("exist");

      // click Delete on alice row
      cy.contains("td", "alice")
        .parent("tr")
        .within(() => {
          cy.contains("button", "Delete").click();
        });
    });

    cy.wait("@deleteUser");

    // Users table should no longer have alice (sessions table can still have her)
    cy.get(".scroll-container").first().within(() => {
      cy.contains("td", "alice").should("not.exist");
      cy.contains("td", "bob").should("exist");
    });
  });

  // ---------- LOGOUT ----------

  it("logs out and redirects to /login", () => {
    cy.contains("button", "Logout").click();

    // Should navigate to /login
    cy.location("pathname").should("eq", "/login");

    // admin_token and admin_username should be cleared
    cy.window().then((win) => {
      expect(win.localStorage.getItem("admin_token")).to.be.null;
      expect(win.localStorage.getItem("admin_username")).to.be.null;
    });
  });
});
