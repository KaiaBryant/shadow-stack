import React, { useEffect, useState } from "react";
import "../styles/Admin.css"; // reuse same dark theme styles

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState("");

  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Load all users + basic activity / level info
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        setError("");

        const res = await fetch("http://localhost:5000/api/admin/users", {
          headers: {
            "Content-Type": "application/json",
            // Example if you later add tokens:
            // Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to load users");
        }

        const data = await res.json();
        // Expected shape: [{ id, username, is_admin, current_level, last_active }, ...]
        setUsers(data);
      } catch (err) {
        setError(err.message || "Error loading users");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Create a brand new admin account
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminUsername.trim() || !newAdminPassword.trim()) {
      setError("Please enter a username and password for the new admin.");
      return;
    }

    try {
      setUpdatingUserId("new-admin");
      setError("");

      const res = await fetch("http://localhost:5000/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newAdminUsername.trim(),
          password: newAdminPassword.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create admin");
      }

      const created = await res.json();
      // Add new admin to the table
      setUsers((prev) => [...prev, created]);

      setNewAdminUsername("");
      setNewAdminPassword("");
      setShowCreateAdmin(false);
    } catch (err) {
      setError(err.message || "Error creating admin.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Promote an existing user to admin
  const handlePromoteToAdmin = async (userId) => {
    try {
      setUpdatingUserId(userId);
      setError("");

      const res = await fetch(
        `http://localhost:5000/api/admin/users/${userId}/make-admin`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to promote user to admin");
      }

      const updated = await res.json();

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updated } : u))
      );
    } catch (err) {
      setError(err.message || "Error promoting user.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Delete a user
  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;

    try {
      setUpdatingUserId(userId);
      setError("");

      const res = await fetch(
        `http://localhost:5000/api/admin/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      setError(err.message || "Error deleting user.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // For “show user activity” – placeholder hook for now
  const handleViewActivity = (user) => {
    // Later this can navigate to /admin/user/:id or open a modal
    alert(
      `Activity for ${user.username} (stub).\n\n` +
        `Current level: ${user.current_level ?? "N/A"}\n` +
        `Last active: ${user.last_active ?? "N/A"}`
    );
  };

  return (
    <div className="admin-dashboard-wrapper">
      <div className="container">
        <div className="admin-dashboard-card">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="admin-dashboard-title mb-0">Admin Dashboard</h2>
            <button
              type="button"
              className="btn btn-sm btn-admin"
              onClick={() => setShowCreateAdmin((prev) => !prev)}
            >
              {showCreateAdmin ? "Close" : "Create New Admin"}
            </button>
          </div>

          {error && <div className="admin-error mb-3">{error}</div>}

          {showCreateAdmin && (
            <form
              onSubmit={handleCreateAdmin}
              className="admin-create-form mb-4"
            >
              <div className="row g-2">
                <div className="col-md-4">
                  <label className="admin-form-label" htmlFor="newAdminUser">
                    Username
                  </label>
                  <input
                    id="newAdminUser"
                    type="text"
                    className="admin-form-control"
                    value={newAdminUsername}
                    onChange={(e) => setNewAdminUsername(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="admin-form-label" htmlFor="newAdminPass">
                    Password
                  </label>
                  <input
                    id="newAdminPass"
                    type="password"
                    className="admin-form-control"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                  />
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button
                    type="submit"
                    className="btn btn-admin w-100"
                    disabled={updatingUserId === "new-admin"}
                  >
                    {updatingUserId === "new-admin"
                      ? "Creating..."
                      : "Create Admin"}
                  </button>
                </div>
              </div>
            </form>
          )}

          <h5 className="section-heading mb-3">Users & Activity</h5>

          {loadingUsers ? (
            <p className="text-light">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-light">No users found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-striped table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Current Level</th>
                    <th>Last Active</th>
                    <th style={{ width: "230px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isAdmin = user.is_admin || user.role === "admin";
                    const isBusy = updatingUserId === user.id;

                    return (
                      <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{isAdmin ? "Admin" : "User"}</td>
                        <td>{user.current_level ?? "—"}</td>
                        <td>{user.last_active ?? "—"}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-info"
                              onClick={() => handleViewActivity(user)}
                            >
                              Activity
                            </button>
                            {!isAdmin && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handlePromoteToAdmin(user.id)}
                                disabled={isBusy}
                              >
                                {isBusy ? "Updating..." : "Make Admin"}
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={isBusy}
                            >
                              {isBusy ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
