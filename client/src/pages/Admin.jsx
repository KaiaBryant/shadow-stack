import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const [error, setError] = useState("");

    const [showCreateAdmin, setShowCreateAdmin] = useState(false);
    const [newAdminUsername, setNewAdminUsername] = useState("");
    const [newAdminPassword, setNewAdminPassword] = useState("");
    const [newAdminPin, setNewAdminPin] = useState("");


    const [busy, setBusy] = useState(false);

    const navigate = useNavigate();

    const token = localStorage.getItem("admin_token");
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token]);
    const adminUsername = localStorage.getItem("admin_username");

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }


    // Logout clears token and redirects 
    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_username");
        navigate("/login");
    };

    // Generic fetch wrapper to auto-send token
    const adminFetch = async (url, options = {}) => {
        const res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                ...(options.headers || {})
            }
        });
        return res;
    };

    // Load all users
    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoadingUsers(true);
                const res = await adminFetch("https://shadow-stack.onrender.com/api/admin/users");

                if (!res.ok) throw new Error("Failed to load users");
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingUsers(false);
            }
        };

        const loadSessions = async () => {
            try {
                setLoadingSessions(true);
                const res = await adminFetch("https://shadow-stack.onrender.com/api/admin/summary");

                if (!res.ok) throw new Error("Failed to load summary");
                const data = await res.json();
                setSessions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingSessions(false);
            }
        };
        loadUsers();
        loadSessions();

        // Auto-refresh sessions every 10s
        // const interval = setInterval(() => {
        //     loadSessions();
        // }, 10000);

        // return () => clearInterval(interval);

    }, []);

    // Create a new admin
    const handleCreateAdmin = async (e) => {
        e.preventDefault();

        if (!newAdminUsername.trim() || !newAdminPassword.trim() || !newAdminPin.trim()) {
            setError("All admin fields are required.");
            return;
        }

        try {
            setBusy(true);
            setError("");

            const res = await adminFetch("https://shadow-stack.onrender.com/api/admin/create-admin", {
                method: "POST",
                body: JSON.stringify({
                    username: newAdminUsername,
                    password: newAdminPassword,
                    pin_code: newAdminPin
                })
            });
            alert("Admin created successfully!");
            setNewAdminUsername("");
            setNewAdminPassword("");
            setNewAdminPin("");
            setShowCreateAdmin(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    };

    // Delete a user
    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            setBusy(true);
            const res = await adminFetch(
                `https://shadow-stack.onrender.com/api/admin/users/${id}`,
                { method: "DELETE" }
            );

            if (!res.ok) throw new Error("Failed to delete user");

            setUsers((prev) => prev.filter((u) => u.id !== id));
            alert("User deleted.");
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="admin-dashboard-wrapper">
            <div className="container">
                <div className="admin-dashboard-card">

                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <h2 className="admin-dashboard-title"> Welcome, <strong>{adminUsername}</strong></h2>
                    </div>
                    {error && <div className="admin-error mb-3">{error}</div>}

                    {/* Users Table */}
                    <h5 className="section-heading mb-3">Users</h5>

                    {loadingUsers ? (
                        <p className="text-light">Loading users...</p>
                    ) : users.length === 0 ? (
                        <p className="text-light">No users found.</p>
                    ) : (
                        <div className="scroll-container mb-4">
                            <table className="table table-dark table-striped table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Character</th>
                                        <th>Created</th>
                                        <th style={{ width: "150px" }}>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.username}</td>
                                            <td>{user.character_id ?? "—"}</td>
                                            <td>{formatTimestamp(user.created_at)}</td>


                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    disabled={busy}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    )}

                    {/* Sessions List */}
                    <h5 className="section-heading mb-3">User Sessions</h5>

                    {loadingSessions ? (
                        <p className="text-light">Loading sessions...</p>
                    ) : sessions.length === 0 ? (
                        <p className="text-light">No sessions found.</p>
                    ) : (
                        <div className="table-responsive scroll-container mb-4">
                            <table className="table table-dark table-striped table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>User ID</th>
                                        <th>Level</th>
                                        {/* <th>Lives</th> */}
                                        <th>Score</th>
                                        <th>Active?</th>
                                        {/* <th>Created</th> */}
                                    </tr>
                                </thead>

                                <tbody>
                                    {sessions.map((s) => (
                                        <tr key={s.user_id}>

                                            <td>{s.username}</td>
                                            <td>{s.user_id}</td>
                                            <td>{s.current_level ?? "—"}</td>
                                            {/* <td>{s.lives_remaining ?? "—"}</td> */}
                                            <td>{s.score ?? "—"}</td>
                                            <td>{Number(s.is_active) === 1 ? "Yes" : "No"}</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <div className="bottom-admin-container">
                    {/* Create new admin user button */}
                    <button
                        // type="button"
                        className="new-admin-btn"
                        onClick={() => setShowCreateAdmin((prev) => !prev)}
                    >
                        {showCreateAdmin ? "Close" : "Create New Admin"}
                    </button>
                    {/* Create Admin Form */}
                    {showCreateAdmin && (
                        <form onSubmit={handleCreateAdmin} className="admin-create-form">
                            <div className="row g-2">
                                <div className="col-md-4">
                                    <label className="admin-form-label">Username</label>
                                    <input
                                        className="admin-form-control"
                                        value={newAdminUsername}
                                        onChange={(e) => setNewAdminUsername(e.target.value)}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="admin-form-label">Password</label>
                                    <input
                                        type="password"
                                        className="admin-form-control"
                                        value={newAdminPassword}
                                        onChange={(e) => setNewAdminPassword(e.target.value)}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="admin-form-label">Pin Code</label>
                                    <input
                                        type="password"
                                        className="admin-form-control"
                                        value={newAdminPin}
                                        onChange={(e) => setNewAdminPin(e.target.value)}
                                    />
                                </div>

                                <div className="col-12 mt-2">
                                    <button className="btn btn-admin w-100" disabled={busy}>
                                        {busy ? "Creating..." : "Create Admin"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                    {/* Logout button*/}
                    <button
                        type="button"
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;