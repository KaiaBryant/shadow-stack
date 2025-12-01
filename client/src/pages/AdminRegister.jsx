import React, { useState } from "react";

function AdminRegister() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [pin, setPin] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const res = await fetch("http://localhost:5000/api/admin/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                password,
                pin_code: pin
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Registration failed.");
            return;
        }

        setMessage("Admin created successfully! You can now log in.");
        setUsername("");
        setPassword("");
        setPin("");
    };

    return (
        <div className="admin-register-wrapper">
            <div className="container" style={{ maxWidth: "500px" }}>
                <h2 className="text-center mb-4">Create Admin Account</h2>

                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                <form onSubmit={handleRegister} className="card p-4">
                    <div className="input mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input mb-3">
                        <label className="form-label">Pin Code</label>
                        <input
                            type="password"
                            className="form-control"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Create Admin
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminRegister;
